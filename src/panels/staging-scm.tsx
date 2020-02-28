import * as React from "react";
import { AppDispatch } from "../store";
import {
  FileState,
  isReadonly,
  FileStateStatus
} from "../events-version-control";
import { VersionControlEvent, VCDispatch } from "../events-version-control";
import { WithStyles, withStyles } from "@material-ui/core";
import { SelectedStyles } from "../styles";
import { v4 } from "uuid";

export const StagingSCM = (props: {
  wsfiles: Record<string, FileState>;
  vcfiles: Record<string, FileState>;
  events: VersionControlEvent[];
  wsDispatch: VCDispatch;
  vcDispatch: VCDispatch;
  appDispatch: AppDispatch;
  selectedFile: string;
}) => {
  return (
    <div>
      <h3>working set</h3>
      <SCM
        appDispatch={props.appDispatch}
        files={props.wsfiles}
        selectedFile={props.selectedFile}
      />

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
            id: v4(),
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
  selectedFile: string;
  filter?(any): boolean;
}) => {
  const handleClick = (fullPath: string) => {
    const value = props.files[fullPath];

    props.appDispatch({
      type: "selectedView",
      fullPath: value.fullPath,
      label: "todo",
      readOnly: isReadonly(value.history, value.revision),
      text: value.text,
      comments: value.commentStore,
      revision: value.revision
    });
  };

  const filteredItems = props.filter
    ? Object.entries(props.files).filter(props.filter)
    : Object.entries(props.files);

  const items = filteredItems.map(([key, value]) => (
    <SCMItem
      key={value.fullPath}
      fullPath={value.fullPath}
      revision={value.revision.toString()}
      status={value.status}
      onClick={handleClick}
      selected={props.selectedFile === value.fullPath}
    />
  ));
  return <ul>{items}</ul>;
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
