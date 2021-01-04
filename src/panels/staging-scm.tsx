import * as React from "react";
import { VersionControlStoreType, Dispatch } from "../store";
import {
  FileState,
  isReadonly,
  FileStateStatus,
  FileEvents,
} from "../events-version-control";
import { VersionControlEvent } from "../events-version-control";
import { Button, Tooltip, WithStyles, withStyles } from "@material-ui/core";
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
  const [textInputOpen, setTextInputOpen] = React.useState<boolean>(false);

  return (
    <div>
      <Tooltip title="Changes that have not been merged to main">
        <h3>working set</h3>
      </Tooltip>
      <SCM
        dispatch={props.dispatch}
        files={props.wsfiles}
        comments={props.generalComments}
        selectedFile={props.selectedFile}
      />
      <Button
        size="small"
        onClick={() => {
          props.dispatch({
            type: "commit",
            storeType: VersionControlStoreType.Working,
            author: props.currentUser,
            id: v4(),
            events: [
              {
                type: "edit",
                fullPath: `new_file_${new Date().toISOString()}.py`, //TODO - dialog needed
                text: "new file",
              },
            ],
          });
        }}
      >
        New File
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
        Commit
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

      <Button
        size="small"
        onClick={() => {
          setTextInputOpen(true);
        }}
        disabled={props.isHeadCommit}
      >
        Make General Comment
      </Button>

      <TextInputDialog
        open={textInputOpen}
        title="Enter general comment"
        onClose={(c) => {
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
      ></TextInputDialog>
    </div>
  );
};

export const SCM = (props: {
  files: Record<string, FileState>;
  comments: ReviewCommentStore;
  dispatch: Dispatch;
  selectedFile: string;
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

  const filteredItems = props.filter
    ? Object.entries(props.files).filter(props.filter)
    : Object.entries(props.files);

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
  recurseComments(
    Object.values(props.comments.comments),
    (v) => v.comment.parentId === null
  );

  const notRenderedIds = Object.values(props.comments.comments).filter(
    (c) => !renderedCommentIds.has(c.comment.id)
  );

  const replyComments = notRenderedIds.map((cs) => (
    <Comment
      onReply={null}
      key={cs.comment.id}
      comment={cs}
      comments={{}}
      depth={0}
      dispatch={null}
    />
  ));

  const onClose = React.useCallback(
    (c) => {
      setTextInputOpen(false);

      c.confirm &&
        props.dispatch({
          type: "commit",
          storeType: VersionControlStoreType.Working,
          author: "props.currentUser",
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
                  createdBy: "current user",
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
      <ul>{comments.concat(replyComments)}</ul>
      <TextInputDialog
        open={textInputOpen}
        title="Reply to comment"
        onClose={onClose}
      ></TextInputDialog>
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
      {props.depth} - {props.comment.comment.text}{" "}
      {props.comment.comment.author} {props.comment.comment.dt}
      <Button
        size="small"
        onClick={() => {
          props.onReply(props.comment.comment.id);
        }}
      >
        reply
      </Button>
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
        style={
          props.status === 2
            ? { textDecoration: "line-through" }
            : { cursor: "pointer" }
        }
        onClick={(e) => {
          props.onClick(props.fullPath);
          e.stopPropagation();
          console.log("here");
        }}
        className={
          props.selected
            ? props.classes.selectedItem
            : props.classes.inactiveItem
        }
      >
        {props.fullPath} @ v{props.revision} - {props.status}
      </li>
    );
  }
);
