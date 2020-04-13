import * as React from "react";
import { VersionControlStoreType, Dispatch } from "../store";
import {
  FileState,
  isReadonly,
  FileStateStatus,
  FileEvents,
} from "../events-version-control";
import { VersionControlEvent } from "../events-version-control";
import { WithStyles, withStyles } from "@material-ui/core";
import { SelectedStyles } from "../styles";
import { v4 } from "uuid";
import { ReviewCommentStore } from "monaco-review";
import { ReviewCommentState } from "monaco-review/dist/events-comments-reducers";

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
  return (
    <div>
      <h3>working set</h3>
      <SCM
        dispatch={props.dispatch}
        files={props.wsfiles}
        comments={props.generalComments}
        selectedFile={props.selectedFile}
      />
      <button
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
          debugger;
          const x = props.dispatch({
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

      <button
        onClick={() => {
          const x = v4();
          // TODO - component needed and dialog for this?
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
                    text: "good morning",
                    lineNumber: 0,
                    createdAt: "",
                    createdBy: props.currentUser,
                    id: x,
                    targetId: null,
                  },
                  {
                    type: "create",
                    text: "good morning to you",
                    lineNumber: 0,
                    createdAt: "",
                    createdBy: props.currentUser,
                    id: v4(),
                    targetId: x,
                  },
                ],
              },
            ],
          });
        }}
        disabled={props.isHeadCommit}
      >
        Make General Comment
      </button>
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

  let comments = Object.values(props.comments.comments)
    .filter((v) => v.comment.parentId === null)
    .map((v) =>
      Comment(v, props.comments.comments, renderedCommentIds, 0, props.dispatch)
    );

  const notRenderedIds = Object.values(props.comments.comments).filter(
    (c) => !renderedCommentIds.has(c.comment.id)
  );

  comments = comments.concat(
    notRenderedIds.map((cs) =>
      Comment(
        cs,
        props.comments.comments,
        renderedCommentIds,
        0,
        props.dispatch
      )
    )
  );

  return (
    <div>
      <ul>{items}</ul>
      <ul>{comments}</ul>
    </div>
  );
};

const Comment = (
  comment: ReviewCommentState,
  comments: Record<string, ReviewCommentState>,
  renderedCommentIds: Set<string>,
  depth: number,
  dispatch: Dispatch
) => {
  renderedCommentIds.add(comment.comment.id);
  return (
    <li>
      {depth} - {comment.comment.text} {comment.comment.author}{" "}
      {comment.comment.dt}
      <button
        onClick={() => {
          dispatch({
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
                    text: "reply" + comment.comment.text,
                    lineNumber: 0,
                    createdAt: "",
                    createdBy: "props.currentUser",
                    id: v4(),
                    targetId: comment.comment.id,
                  },
                ],
              },
            ],
          });
        }}
      >
        reply
      </button>
      <ul>
        {Object.values(comments)
          .filter((c) => c.comment.parentId === comment.comment.id)
          .map((c) =>
            Comment(c, comments, renderedCommentIds, depth + 1, dispatch)
          )}
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
        style={props.status === 2 ? { textDecoration: "line-through" } : {}}
        onClick={() => props.onClick(props.fullPath)}
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
