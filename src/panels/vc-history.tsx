import * as React from "react";
import {
  VersionControlState,
  VersionControlCommitEvent,
  FileEditEvent,
  FileCommentEvent
} from "../events-version-control";
import { AppDispatch, SelectedView } from "../store";
import { SelectedStyles } from "../styles";
import { withStyles, WithStyles } from "@material-ui/core";

export const VCHistory = (props: {
  vcStore: VersionControlState;
  appDispatch: AppDispatch;
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
            appDispatch={props.appDispatch}
            selected={scid === ce.id}
          ></SelectCommitButton>
          {ce.events.map((e, idx) => (
            <div key={idx}>
              {(e.type === "edit" || e.type == "comment") && (
                <SelectEditButton
                  commitId={ce.id}
                  selectedView={props.selectedView}
                  vcStore={props.vcStore}
                  appDispatch={props.appDispatch}
                  editEvent={e}
                ></SelectEditButton>
              )}
              <div style={{ fontSize: 10 }}>{JSON.stringify(e)}</div>
            </div>
          ))}
        </div>
      );
    });

  return <div>{elements}</div>;
};

export const SelectCommitButton = withStyles(SelectedStyles)(
  (
    props: {
      commitId: string;
      appDispatch: AppDispatch;
      selected: boolean;
    } & WithStyles<typeof SelectedStyles>
  ) => (
    <React.Fragment>
      <button
        onClick={() => {
          props.appDispatch({ type: "selectCommit", commitId: props.commitId });
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
      appDispatch: AppDispatch;
      editEvent: FileEditEvent | FileCommentEvent;
      selectedView: SelectedView;
    } & WithStyles<typeof SelectedStyles>
  ) => {
    const selected =
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
            const f =
              props.vcStore.commits[props.commitId][props.editEvent.fullPath];
            props.appDispatch({
              type: "selectCommit",
              commitId: props.commitId
            });
            props.appDispatch({
              type: "selectedView",
              fullPath: f.fullPath,
              revision: f.revision,
              text: f.text
            });
          }}
        >
          Select Revision
        </button>
        <span
          className={
            selected ? props.classes.selectedItem : props.classes.inactiveItem
          }
        >
          {props.editEvent.type}
        </span>
      </React.Fragment>
    );
  }
);
