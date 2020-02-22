import * as React from "react";
import {
  VersionControlState,
  VersionControlCommitEvent
} from "../events-version-control";
import { AppDispatch } from "../store";
import { CssBaseline } from "@material-ui/core";

export const VCHistory = (props: {
  vcStore: VersionControlState;
  appDispatch: AppDispatch;
}) => {
  const elements = props.vcStore.events
    .filter(e => e.type === "commit")
    .map((ce: VersionControlCommitEvent) => {
      return (
        <div>
          <button
            onClick={() => {
              props.appDispatch({ type: "selectCommit", commitId: ce.id });
            }}
          >
            {ce.id}
          </button>
          {ce.events.map(e => (
            <div>{JSON.stringify(e)}</div>
          ))}
        </div>
      );
    });

  return <div>{elements}</div>;
};
