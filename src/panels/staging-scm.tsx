import * as React from "react";
import { AppDispatch } from "../store";
import { FileState } from "../events-version-control";
import { VersionControlEvent, VCDispatch } from "../events-version-control";

export const StagingSCM = (props: {
  wsfiles: Record<string, FileState>;
  vcfiles: Record<string, FileState>;
  events: VersionControlEvent[];
  wsDispatch: VCDispatch;
  vcDispatch: VCDispatch;
  appDispatch: AppDispatch;
}) => {
  return (
    <div>
      <h3>working set</h3>
      <SCM appDispatch={props.appDispatch} files={props.wsfiles} />

      <button
        onClick={() => {
          let events = [];
          for (const e of props.events) {
            if (e.type == "commit") {
              events = events.concat(e.events);
            }
          }

          props.vcDispatch({
            type: "commit",
            author: "james",
            id: "id-2",
            events: events
          });
          props.wsDispatch({ type: "reset" });
        }}
        disabled={props.events.length == 0}
      >
        Commit
      </button>

      <button
        onClick={() => {
          props.wsDispatch({ type: "reset" });
        }}
        disabled={props.events.length == 0}
      >
        Discard Changes
      </button>
    </div>
  );
};

export const SCM = (props: {
  files: Record<string, FileState>;
  appDispatch: AppDispatch;
}) => {
  const handleClick = (fullPath: string) => {
    const value = props.files[fullPath];
    props.appDispatch({ type: "selectScript", fullPath: value.fullPath });
    props.appDispatch({
      type: "selectedView",
      fullPath: value.fullPath,
      text: value.text,
      comments: value.commentStore
    });
  };

  const items = Object.entries(props.files).map(([key, value]) => (
    <SCMItem
      key={value.fullPath}
      fullPath={value.fullPath}
      revision={value.revision.toString()}
      onClick={handleClick}
    />
  ));
  return <ul>{items}</ul>;
};

const SCMItem = (props: {
  fullPath: string;
  revision: string;
  onClick(fullPath: string): void;
}) => {
  return (
    <li onClick={() => props.onClick(props.fullPath)}>
      {props.fullPath} @ v{props.revision}
    </li>
  );
};
