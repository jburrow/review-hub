import * as React from "react";
import { VersionControlState, VersionControlCommitEvent, FileEvents } from "../events-version-control";
import { AppState, Dispatch, isReadonly, VersionControlStoreType } from "../store";
import { AppStyles, SelectedStyles } from "../styles";

import { SelectedView } from "../interaction-store";
import { ReviewCommentEvent } from "monaco-review";
import { EnumNumberMember } from "@babel/types";

export const Timeline = (props: {
  store: AppState;
  dispatch: Dispatch;
  selectedCommitId: string;
  selectedView: SelectedView;
}) => {
  const scid = props.selectedCommitId ? props.selectedCommitId : props.store.vcStore.headCommitId;

  const elements = props.store.vcStore.events.map((ce, idx) => {
    switch (ce.type) {
      case "information":
        return <div key={idx}>{ce.message}</div>;
      case "commit":
        return (
          <VersionControlCommitEventComponent
            key={idx}
            ce={ce}
            selectedView={props.selectedView}
            idx={idx}
            scid={scid}
            store={props.store}
            dispatch={props.dispatch}
          />
        );
    }
  });

  return <div>{elements}</div>;
};

export const VersionControlCommitEventComponent = (props: {
  dispatch: Dispatch;
  idx: number;
  scid: string;
  ce: VersionControlCommitEvent;
  selectedView: SelectedView;
  store: AppState;
}) => {
  return (
    <div>
      <SelectCommitButton
        commitId={props.ce.id}
        dispatch={props.dispatch}
        selected={props.scid === props.ce.id}
      ></SelectCommitButton>
      {props.ce.events.map((e, idx) => (
        <div key={idx}>
          {renderFileEvent(e)}
          {(e.type === "edit" || e.type == "comment" || e.type == "rename") && (
            <SelectEditButton
              commitId={props.ce.id}
              selectedView={props.selectedView}
              store={props.store}
              dispatch={props.dispatch}
              editEvent={e}
            ></SelectEditButton>
          )}
          {/* <div style={{ fontSize: 10 }}>{JSON.stringify(e)}</div> */}
        </div>
      ))}
      <hr />
    </div>
  );
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
      return <Chip label={`${e.type} - ${(e as any).fullPath} @ ${(e as any).revision}`} />;
  }
};

export const Chip = (props: { label: string; color?: string; size?: string; variant?: string }) => {
  return <div>{props.label}</div>;
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
      return <Chip label={e.type} />;
  }
};

export const SelectCommitButton = (props: { commitId: string; dispatch: Dispatch; selected: boolean }) => (
  <React.Fragment>
    <button
      onClick={() => {
        props.dispatch({ type: "selectCommit", commitId: props.commitId });
      }}
    >
      Select Commit
    </button>
    <span style={props.selected ? SelectedStyles.selectedItem : SelectedStyles.inactiveItem}>{props.commitId}</span>
  </React.Fragment>
);

export const SelectEditButton = (props: {
  commitId: string;
  store: AppState;
  dispatch: Dispatch;
  editEvent: FileEvents;
  selectedView: SelectedView;
}) => {
  //Dodgy
  const selected =
    (props.editEvent.type === "comment" || //TODO - pull this out into a 'types with filename'
      props.editEvent.type === "edit" ||
      props.editEvent.type === "rename" ||
      props.editEvent.type === "delete") &&
    props.store.vcStore.commits[props.commitId] &&
    props.selectedView?.fullPath == props.editEvent.fullPath &&
    props.selectedView?.revision == props.store.vcStore.commits[props.commitId][props.editEvent.fullPath].revision;

  return (
    <React.Fragment>
      <button
        style={{ marginLeft: 50 }}
        onClick={() => {
          if (
            //Dodgy
            props.editEvent.type === "comment" ||
            props.editEvent.type === "edit" ||
            props.editEvent.type === "rename" ||
            props.editEvent.type === "delete"
          ) {
            const f = props.store.vcStore.commits[props.commitId][props.editEvent.fullPath];
            props.dispatch({
              type: "selectCommit",
              commitId: props.commitId,
            });
            props.dispatch({
              type: "selectedView",
              selectedView: {
                type: "view",
                fullPath: f.fullPath,
                revision: f.revision,
                readOnly: isReadonly(props.store, f.fullPath, f.revision),
                text: f.text,
                storeType: VersionControlStoreType.Branch,
              },
            });
          }
        }}
      >
        View Revision
      </button>
      {selected && <span style={selected ? SelectedStyles.selectedItem : SelectedStyles.inactiveItem}>Selected</span>}
    </React.Fragment>
  );
};
