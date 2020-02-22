import * as React from "react";
import {
  VersionControlState,
  VersionControlCommitEvent
} from "../events-version-control";
import { AppDispatch } from "../store";

export const VCHistory = (props: {
  vcStore: VersionControlState;
  appDispatch: AppDispatch;
}) => {
  const elements = props.vcStore.events
    .filter(e => e.type === "commit")
    .map((ce: VersionControlCommitEvent, idx) => {
      return (
        <div key={idx}>
          <SelectCommitButton
            commitId={ce.id}
            appDispatch={props.appDispatch}
          ></SelectCommitButton>
          {ce.events.map((e, idx) => (
            <div key={idx}>{JSON.stringify(e)}</div>
          ))}
        </div>
      );
    });

  return <div>{elements}</div>;
};

export const SelectCommitButton: React.FunctionComponent<{
  commitId: string;
  appDispatch: AppDispatch;
}> = props => (
  <React.Fragment>
    <button
      onClick={() => {
        props.appDispatch({ type: "selectCommit", commitId: props.commitId });
      }}
    >
      Select
    </button>
    {props.commitId}
  </React.Fragment>
);
