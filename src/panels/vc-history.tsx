import * as React from "react";
import {
  VersionControlState,
  VersionControlCommitEvent
} from "../events-version-control";
import { AppDispatch } from "../store";
import { SelectedStyles } from "../styles";
import { withStyles, WithStyles } from "@material-ui/core";

export const VCHistory = (props: {
  vcStore: VersionControlState;
  appDispatch: AppDispatch;
  selectedCommitId: string;
}) => {
  const scid = props.selectedCommitId
    ? props.selectedCommitId
    : props.vcStore.headCommitId;
  console.log("x", scid, props.selectedCommitId, props.vcStore.headCommitId);

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
              {e.type} - {JSON.stringify(e)}
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
        Select
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
