import * as React from "react";
import {
  VersionControlState,
  VersionControlCommitEvent,
  FileEditEvent,
  FileCommentEvent,
  isReadonly,
  FileRenameEvent,
  FileEvents
} from "../events-version-control";
import { Dispatch } from "../store";
import { SelectedStyles } from "../styles";
import { withStyles, WithStyles } from "@material-ui/core";
import { SelectedView } from "../interaction-store";
import { ReviewCommentEvent } from "monaco-review";

export const VCHistory = (props: {
  vcStore: VersionControlState;
  dispatch: Dispatch;
  selectedCommitId: string;
  selectedView: SelectedView;
}) => {
  const scid = props.selectedCommitId
    ? props.selectedCommitId
    : props.vcStore.headCommitId;

  const elements = props.vcStore.events
    .filter(e => e.type === "commit")
    .map((ce: VersionControlCommitEvent, idx) => {
      return (
        <div key={idx}>
          <SelectCommitButton
            commitId={ce.id}
            dispatch={props.dispatch}
            selected={scid === ce.id}
          ></SelectCommitButton>
          {ce.events.map((e, idx) => (
            <div key={idx}>
              {renderFileEvent(e)}
              {(e.type === "edit" ||
                e.type == "comment" ||
                e.type == "rename") && (
                <SelectEditButton
                  commitId={ce.id}
                  selectedView={props.selectedView}
                  vcStore={props.vcStore}
                  dispatch={props.dispatch}
                  editEvent={e}
                ></SelectEditButton>
              )}
              {/* <div style={{ fontSize: 10 }}>{JSON.stringify(e)}</div> */}
            </div>
          ))}
        </div>
      );
    });

  return <div>{elements}</div>;
};

export const renderFileEvent = (e: FileEvents) => {
  switch (e.type) {
    case "comment":
      return (
        <ul>
          Comments:
          {e.commentEvents.map((c, idx) => (
            <li key={idx}>{renderCommentEvent(c)}</li>
          ))}
        </ul>
      );
    default:
      return <div>{e.type}</div>;
  }
};

export const renderCommentEvent = (e: ReviewCommentEvent) => {
  switch (e.type) {
    case "create":
      return (
        <div>
          {e.text} by {e.createdBy}
        </div>
      );

    default:
      return <div>{e.type}</div>;
  }
};

export const SelectCommitButton = withStyles(SelectedStyles)(
  (
    props: {
      commitId: string;
      dispatch: Dispatch;
      selected: boolean;
    } & WithStyles<typeof SelectedStyles>
  ) => (
    <React.Fragment>
      <button
        onClick={() => {
          props.dispatch({ type: "selectCommit", commitId: props.commitId });
        }}
      >
        Select Commit
      </button>
      <span
        className={
          props.selected
            ? props.classes.selectedItem
            : props.classes.inactiveItem
        }
      >
        {props.commitId}
      </span>
    </React.Fragment>
  )
);

export const SelectEditButton = withStyles(SelectedStyles)(
  (
    props: {
      commitId: string;
      vcStore: VersionControlState;
      dispatch: Dispatch;
      editEvent: FileEvents;
      selectedView: SelectedView;
    } & WithStyles<typeof SelectedStyles>
  ) => {
    const selected =
      (props.editEvent.type === "comment" || //TODO - pull this out into a 'types with filename'
        props.editEvent.type === "edit" ||
        props.editEvent.type === "rename" ||
        props.editEvent.type === "delete") &&
      props.vcStore.commits[props.commitId] &&
      props.selectedView?.fullPath == props.editEvent.fullPath &&
      props.selectedView?.revision ==
        props.vcStore.commits[props.commitId][props.editEvent.fullPath]
          .revision;

    return (
      <React.Fragment>
        <button
          style={{ marginLeft: 50 }}
          onClick={() => {
            if (
              props.editEvent.type === "comment" ||
              props.editEvent.type === "edit" ||
              props.editEvent.type === "rename" ||
              props.editEvent.type === "delete"
            ) {
              const f =
                props.vcStore.commits[props.commitId][props.editEvent.fullPath];
              props.dispatch({
                type: "selectCommit",
                commitId: props.commitId
              });
              props.dispatch({
                type: "selectedView",
                fullPath: f.fullPath,
                revision: f.revision,
                readOnly: isReadonly(
                  props.vcStore.files[f.fullPath].history,
                  f.revision
                ),
                text: f.text
              });
            }
          }}
        >
          View Revision
        </button>
        {selected && (
          <span
            className={
              selected ? props.classes.selectedItem : props.classes.inactiveItem
            }
          >
            Selected
          </span>
        )}
      </React.Fragment>
    );
  }
);
