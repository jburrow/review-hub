import * as React from "react";
import { VersionControlStoreType, Dispatch, AppState, isReadonly } from "../store";
import { FileState, FileStateStatus, FileEvents, Revision } from "../events-version-control";
import { VersionControlEvent } from "../events-version-control";

import { SelectedStyles } from "../styles";
import { v4 } from "uuid";
import { ReviewCommentStore } from "monaco-review";
import { ReviewCommentState } from "monaco-review/dist/events-comments-reducers";
import { TextInputDialog } from "../dialogs/text-input";
import { SelectedView } from "../interaction-store";
import { Chip } from "./timeline";

export const StagingSCM = (props: {
  currentUser: string;
  wsfiles: Record<string, FileState>;
  vcfiles: Record<string, FileState>;
  events: VersionControlEvent[];
  generalComments: ReviewCommentStore;
  dispatch: Dispatch;
  selectedFile: SelectedView;
  isHeadCommit: boolean;
  store: AppState;
}) => {
  const [generalCommentOpen, setGeneralCommentOpen] = React.useState<boolean>(false);
  const [newFileOpen, setNewFileOpen] = React.useState<boolean>(false);

  return (
    <div>
      <h3>Working set</h3>

      <SCM
        dispatch={props.dispatch}
        currentUser={props.currentUser}
        files={props.wsfiles}
        comments={props.generalComments}
        selectedFile={props.selectedFile}
        storeType={VersionControlStoreType.Working}
        store={props.store}
      />
      <button
        disabled={newFileOpen || props.isHeadCommit}
        onClick={() => {
          setNewFileOpen(true);
        }}
      >
        Create New File
      </button>

      <button
        disabled={generalCommentOpen || props.isHeadCommit}
        onClick={() => {
          setGeneralCommentOpen(true);
        }}
      >
        Comment
      </button>

      <button
        onClick={() => {
          const events = props.events
            .filter((e) => e.type === "commit")
            .reduce<FileEvents[]>((acc, e) => {
              if (e.type === "commit") {
                return acc.concat(e.events);
              } else {
                return acc;
              }
            }, []);
          props.dispatch({
            storeType: VersionControlStoreType.Branch,
            type: "commit",
            author: props.currentUser,
            id: v4(),
            events: events,
          });
        }}
        disabled={props.events.length == 0}
      >
        Save All
      </button>

      <button
        onClick={() => {
          props.dispatch({
            type: "reset",
            storeType: VersionControlStoreType.Working,
          });
        }}
        disabled={props.events.length == 0}
      >
        Discard Changes
      </button>

      <TextInputDialog
        open={generalCommentOpen}
        title="Enter general comment"
        onClose={(c) => {
          setGeneralCommentOpen(false);

          if (c.confirm) {
            props.dispatch({
              type: "commit",
              storeType: VersionControlStoreType.Working,
              author: props.currentUser,
              id: v4(),
              events: [
                {
                  type: "general-comment",
                  commentEvents: [
                    {
                      type: "create",
                      text: c.text,
                      lineNumber: 0,
                      createdAt: new Date().getTime(),
                      createdBy: props.currentUser,
                      id: v4(),
                      targetId: null,
                    },
                  ],
                },
              ],
            });
          }
        }}
      />

      <TextInputDialog
        open={newFileOpen}
        title="Create a new file"
        onClose={(c) => {
          setNewFileOpen(false);

          if (c.confirm) {
            const fullPath = c.text;

            props.dispatch({
              type: "commit",
              storeType: VersionControlStoreType.Working,
              author: props.currentUser,
              id: v4(),
              events: [
                {
                  type: "edit",
                  fullPath,
                  text: "",
                  revision: null,
                },
              ],
            });

            props.dispatch({
              type: "selectedView",
              selectedView: {
                fullPath,
                revision: null,
                type: "view",
                storeType: VersionControlStoreType.Working,
                text: "",
                readOnly: false,
              },
            });
          }
        }}
      />
    </div>
  );
};

export const SCM = (props: {
  storeType: VersionControlStoreType;
  files: Record<string, FileState>;
  comments: ReviewCommentStore;
  dispatch: Dispatch;
  selectedFile: SelectedView;
  currentUser: string;
  filter?(any): boolean;
  store: AppState;
}) => {
  const [textInputOpen, setTextInputOpen] = React.useState<boolean>(false);
  const [messageId, setMessageId] = React.useState<string>(null);

  const handleClick = (fullPath: string, readOnly: boolean) => {
    const value = props.files[fullPath];
    props.dispatch({
      type: "selectedView",
      selectedView: {
        type: "view",
        fullPath: value.fullPath,
        readOnly,
        text: value.text,
        comments: value.commentStore,
        revision: value.revision,
        storeType: props.storeType,
      },
    });
  };

  const filteredItems = props.filter ? Object.entries(props.files).filter(props.filter) : Object.entries(props.files);

  const items = filteredItems.map(([, value]) => (
    <SCMItem
      key={value.fullPath}
      fullPath={value.fullPath}
      revision={value.revision}
      store={props.store}
      status={value.status}
      onClick={handleClick}
      selected={props.selectedFile?.fullPath === value.fullPath && props.selectedFile?.revision === value.revision}
    />
  ));

  const renderedCommentIds = new Set<string>();
  const onReply = (messageId: string) => {
    setMessageId(messageId);
    setTextInputOpen(true);
  };
  const comments = Object.values(props.comments.comments)
    .filter((v) => v.comment.parentId === null)
    .map((v) => (
      <Comment
        onReply={onReply}
        key={v.comment.id}
        comment={v}
        comments={props.comments.comments}
        depth={0}
        dispatch={props.dispatch}
      />
    ));

  //Finds all the comments that are already rendered [ replies without parents ]
  const recurseComments = (cs, fn) => {
    cs.filter(fn).map((c) => {
      renderedCommentIds.add(c.comment.id);
      recurseComments(cs, (cc) => cc.comment.parentId == c.comment.id);
    });
  };
  recurseComments(Object.values(props.comments.comments), (v) => v.comment.parentId === null);

  const notRenderedIds = Object.values(props.comments.comments).filter((c) => !renderedCommentIds.has(c.comment.id));

  const replyComments = notRenderedIds.map((cs) => (
    <Comment onReply={null} key={cs.comment.id} comment={cs} comments={{}} depth={0} dispatch={null} />
  ));

  const onClose = React.useCallback(
    (c) => {
      setTextInputOpen(false);

      c.confirm &&
        props.dispatch({
          type: "commit",
          storeType: VersionControlStoreType.Working,
          author: props.currentUser,
          id: v4(),
          events: [
            {
              type: "general-comment",
              commentEvents: [
                {
                  type: "create",
                  text: c.text,
                  lineNumber: 0,
                  createdAt: new Date().getTime(),
                  createdBy: props.currentUser,
                  id: v4(),
                  targetId: messageId,
                },
              ],
            },
          ],
        });
    },
    [messageId]
  );

  return (
    <div>
      <ul>{items}</ul>
      {comments.length + replyComments.length ? <h3>General Comments</h3> : null}
      <ul>{comments.concat(replyComments)}</ul>
      <TextInputDialog open={textInputOpen} title="Reply to comment" onClose={onClose}></TextInputDialog>
    </div>
  );
};

const Comment = (props: {
  onReply(messageId: string): void;
  comment: ReviewCommentState;
  comments: Record<string, ReviewCommentState>;
  depth: number;
  dispatch: Dispatch;
}) => {
  return (
    <li>
      {props.depth} - {props.comment.comment.text} {props.comment.comment.author} {props.comment.comment.dt}
      <a
        onClick={() => {
          props.onReply(props.comment.comment.id);
        }}
      >
        reply
      </a>
      <ul>
        {Object.values(props.comments)
          .filter((c) => c.comment.parentId === props.comment.comment.id)
          .map((c) => (
            <Comment
              onReply={props.onReply}
              key={c.comment.id}
              comment={c}
              comments={props.comments}
              depth={props.depth + 1}
              dispatch={props.dispatch}
            />
          ))}
      </ul>
    </li>
  );
};

const SCMItem = (props: {
  fullPath: string;
  revision: Revision;
  status: FileStateStatus;
  store: AppState;
  onClick(fullPath: string, readOnly: boolean): void;
  selected: boolean;
}) => {
  return (
    <li
      style={{
        ...(props.selected ? SelectedStyles.selectedItem : SelectedStyles.inactiveItem),
        ...(props.status === 2 ? { textDecoration: "line-through" } : { cursor: "pointer" }),
      }}
      onClick={(e) => {
        props.onClick(props.fullPath, isReadonly(props.store, props.fullPath, props.revision));
      }}
    >
      {props.fullPath} @ v{props.revision} - {props.status}
    </li>
  );
};

export const SCMPanel = (props: { dispatch: Dispatch; store: AppState }) => {
  const activeFiles = props.store.interactionStore.selectedCommitId
    ? props.store.vcStore.commits[props.store.interactionStore.selectedCommitId]
    : props.store.vcStore.files;

  return (
    <React.Fragment>
      {props.store.mainStore && false ? (
        <React.Fragment>
          <SCM
            dispatch={props.dispatch}
            files={props.store.mainStore?.files ?? {}}
            currentUser={props.store.interactionStore.currentUser}
            selectedFile={props.store.interactionStore.selectedView}
            comments={{ comments: {} }}
            filter={(i) => i[1].status === FileStateStatus.active}
            storeType={VersionControlStoreType.Main}
            store={props.store}
          />
          <Chip label={`Main Events: #${props.store.mainStore?.events.length}`} size="small" />
          <hr />
        </React.Fragment>
      ) : null}

      <SCM
        dispatch={props.dispatch}
        files={activeFiles}
        currentUser={props.store.interactionStore.currentUser}
        selectedFile={props.store.interactionStore.selectedView}
        comments={props.store.vcStore.commentStore}
        filter={(i) => i[1].status === FileStateStatus.active}
        storeType={VersionControlStoreType.Branch}
        store={props.store}
      />
      <Chip label={`Commited Events: #${props.store.vcStore.events.length}`} size="small" />
      <hr />
      <StagingSCM
        dispatch={props.dispatch}
        isHeadCommit={props.store.isHeadCommit}
        currentUser={props.store.interactionStore.currentUser}
        generalComments={props.store.wsStore.commentStore}
        events={props.store.wsStore.events}
        wsfiles={props.store.wsStore.files}
        vcfiles={props.store.vcStore.files}
        selectedFile={props.store.interactionStore.selectedView}
        store={props.store}
      ></StagingSCM>
      <Chip label={`Working Events: #${props.store.wsStore.events.length}`} size="small" />
    </React.Fragment>
  );
};
