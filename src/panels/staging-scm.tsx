import * as React from "react";
import { VersionControlStoreType, Dispatch, AppState } from "../store";
import { FileState, isReadonly, FileStateStatus, FileEvents } from "../events-version-control";
import { VersionControlEvent } from "../events-version-control";
import { Button, Chip, Divider, Link, Tooltip, WithStyles, withStyles } from "@material-ui/core";
import { SelectedStyles } from "../styles";
import { v4 } from "uuid";
import { ReviewCommentStore } from "monaco-review";
import { ReviewCommentState } from "monaco-review/dist/events-comments-reducers";
import { TextInputDialog } from "../dialogs/text-input";

export const StagingSCM = (props: {
  currentUser: string;
  wsfiles: Record<string, FileState>;
  vcfiles: Record<string, FileState>;
  events: VersionControlEvent[];
  generalComments: ReviewCommentStore;
  dispatch: Dispatch;
  selectedFile: string;
  isHeadCommit: boolean;
}) => {
  const [generalCommentOpen, setGeneralCommentOpen] = React.useState<boolean>(false);
  const [newFileOpen, setNewFileOpen] = React.useState<boolean>(false);

  return (
    <div>
      <Tooltip title="Changes that have not been merged to main">
        <h3>Working set</h3>
      </Tooltip>
      <SCM
        dispatch={props.dispatch}
        currentUser={props.currentUser}
        files={props.wsfiles}
        comments={props.generalComments}
        selectedFile={props.selectedFile}
      />
      <Button
        size="small"
        onClick={() => {
          setNewFileOpen(true);
        }}
      >
        Create New File
      </Button>

      <Button
        size="small"
        onClick={() => {
          setGeneralCommentOpen(true);
        }}
        disabled={props.isHeadCommit}
      >
        Comment
      </Button>

      <Button
        size="small"
        variant="contained"
        color="primary"
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
            storeType: VersionControlStoreType.VersionControl,
            type: "commit",
            author: props.currentUser,
            id: v4(),
            events: events,
          });
        }}
        disabled={props.events.length == 0}
      >
        Save All
      </Button>

      <Button
        size="small"
        onClick={() => {
          props.dispatch({
            type: "reset",
            storeType: VersionControlStoreType.Working,
          });
        }}
        disabled={props.events.length == 0}
      >
        Discard Changes
      </Button>

      <TextInputDialog
        open={generalCommentOpen}
        title="Enter general comment"
        onClose={(c) => {
          setGeneralCommentOpen(false);

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
                      createdAt: "",
                      createdBy: props.currentUser,
                      id: v4(),
                      targetId: null,
                    },
                  ],
                },
              ],
            });
        }}
      />

      <TextInputDialog
        open={newFileOpen}
        title="Create a new file"
        onClose={(c) => {
          setNewFileOpen(false);

          c.confirm &&
            props.dispatch({
              type: "commit",
              storeType: VersionControlStoreType.Working,
              author: props.currentUser,
              id: v4(),
              events: [
                {
                  type: "edit",
                  fullPath: c.text,
                  text: "",
                  revision: 0,
                },
              ],
            });
        }}
      />
    </div>
  );
};

export const SCM = (props: {
  files: Record<string, FileState>;
  comments: ReviewCommentStore;
  dispatch: Dispatch;
  selectedFile: string;
  currentUser: string;
  filter?(any): boolean;
}) => {
  const [textInputOpen, setTextInputOpen] = React.useState<boolean>(false);
  const [messageId, setMessageId] = React.useState<string>(null);

  const handleClick = (fullPath: string) => {
    const value = props.files[fullPath];
    props.dispatch({
      type: "selectedView",
      fullPath: value.fullPath,
      readOnly: isReadonly(value.history, value.revision),
      text: value.text,
      comments: value.commentStore,
      revision: value.revision,
    });
  };

  const filteredItems = props.filter ? Object.entries(props.files).filter(props.filter) : Object.entries(props.files);

  const items = filteredItems.map(([, value]) => (
    <SCMItem
      key={value.fullPath}
      fullPath={value.fullPath}
      revision={value.revision.toString()}
      status={value.status}
      onClick={handleClick}
      selected={props.selectedFile === value.fullPath}
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
                  createdAt: new Date().toISOString(),
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
      <Link
        onClick={() => {
          props.onReply(props.comment.comment.id);
        }}
      >
        reply
      </Link>
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

const SCMItem = withStyles(SelectedStyles)(
  (
    props: {
      fullPath: string;
      revision: string;
      status: FileStateStatus;
      onClick(fullPath: string): void;
      selected: boolean;
    } & WithStyles<typeof SelectedStyles>
  ) => {
    return (
      <li
        style={props.status === 2 ? { textDecoration: "line-through" } : { cursor: "pointer" }}
        onClick={(e) => {
          props.onClick(props.fullPath);
          e.stopPropagation();
          console.log("here");
        }}
        className={props.selected ? props.classes.selectedItem : props.classes.inactiveItem}
      >
        {props.fullPath} @ v{props.revision} - {props.status}
      </li>
    );
  }
);

export const SCMPanel = (props: { dispatch: Dispatch; store: AppState }) => {
  const activeFiles = props.store.interactionStore.selectedCommitId
    ? props.store.vcStore.commits[props.store.interactionStore.selectedCommitId]
    : props.store.vcStore.files;

  return (
    <React.Fragment>
      {props.store.mainStore && (
        <React.Fragment>
          <SCM
            dispatch={props.dispatch}
            files={props.store.mainStore?.files ?? {}}
            currentUser={props.store.interactionStore.currentUser}
            selectedFile={props.store.interactionStore.selectedView?.fullPath}
            comments={{ comments: {} }}
            filter={(i) => i[1].status === FileStateStatus.active}
          />
          <Chip label={`Main Events: #${props.store.mainStore?.events.length}`} size="small" />
          <Divider />
        </React.Fragment>
      )}

      <SCM
        dispatch={props.dispatch}
        files={activeFiles}
        currentUser={props.store.interactionStore.currentUser}
        selectedFile={props.store.interactionStore.selectedView?.fullPath}
        comments={props.store.vcStore.commentStore}
        filter={(i) => i[1].status === FileStateStatus.active}
      />
      <Chip label={`Commited Events: #${props.store.vcStore.events.length}`} size="small" />
      <Divider />
      <StagingSCM
        dispatch={props.dispatch}
        isHeadCommit={props.store.isHeadCommit}
        currentUser={props.store.interactionStore.currentUser}
        generalComments={props.store.wsStore.commentStore}
        events={props.store.wsStore.events}
        wsfiles={props.store.wsStore.files}
        vcfiles={props.store.vcStore.files}
        selectedFile={props.store.interactionStore.selectedView?.fullPath}
      ></StagingSCM>
      <Chip label={`Working Events: #${props.store.wsStore.events.length}`} size="small" />
    </React.Fragment>
  );
};
