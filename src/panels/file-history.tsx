import * as React from "react";
import {
  AppState,
  Dispatch,
  getFile,
  isReadonly,
  VersionControlStoreType,
  versionControlStoreTypeLabel,
} from "../store";
import { FileStateHistory } from "../events-version-control";

import { SelectedStyles } from "../styles";
import { SelectedView } from "../interaction-store";
import { Chip } from "./timeline";

export const FileHistoryItem = (props: { history: FileStateHistory; selectedView: SelectedView }) => {
  const comments = props.history.fileState.commentStore?.comments || {};

  return (
    <span>
      <span
        style={
          props.selectedView?.revision === props.history.fileState.revision
            ? SelectedStyles.selectedItem
            : SelectedStyles.inactiveItem
        }
      >
        v{props.history.fileState.revision}
      </span>{" "}
      <span>{Object.values(comments).length}</span> <span>{timeConverter(props.history.event.createdAt)}</span>
    </span>
  );
};

export function timeConverter(timestamp: number) {
  if (timestamp) {
    const a = new Date(timestamp);
    const year = a.getFullYear();
    const month = a.getMonth().toString().padStart(2, "0");
    const date = a.getDate().toString().padStart(2, "0");
    const hour = a.getHours().toString().padStart(2, "0");
    const min = a.getMinutes().toString().padStart(2, "0");
    const sec = a.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${date} ${hour}:${min}:${sec}`;
  } else {
    return "";
  }
}

export const FileHistory = (props: { dispatch: Dispatch; store: AppState }) => {
  const [selected, setSelected] = React.useState<number[]>([]);
  const selectedView = props.store.interactionStore.selectedView;
  const file = getFile(props.store, selectedView?.storeType, selectedView?.fullPath)?.file;

  if (file) {
    return (
      <div>
        <Chip label={versionControlStoreTypeLabel(selectedView.storeType)} />

        {props.store.mainStore &&
        ((props.store.interactionStore.selectedView?.type == "diff" &&
          props.store.interactionStore.selectedView.originalStoreType !== VersionControlStoreType.Main) ||
          (props.store.interactionStore.selectedView?.type == "view" &&
            props.store.interactionStore.selectedView.storeType !== VersionControlStoreType.Main)) ? (
          <button
            onClick={() => {
              const active = getFile(
                props.store,
                props.store.interactionStore.selectedView.storeType,
                props.store.interactionStore.selectedView.fullPath
              );
              const m = active.file;

              const original = getFile(
                props.store,
                VersionControlStoreType.Main,
                props.store.interactionStore.selectedView.fullPath
              ).file;
              const readOnly =
                isReadonly(props.store, selectedView.fullPath, m.revision) &&
                props.store.interactionStore.selectedView.storeType !== VersionControlStoreType.Working;
              //TODO - review this logic - not sure this is now correct

              props.dispatch({
                type: "selectedView",
                selectedView: {
                  type: "diff",
                  fullPath: file.fullPath,
                  label: `base:${original.revision} v other:${m.revision}`,
                  text: m.text,
                  readOnly,
                  revision: m.revision,
                  original: original.text,
                  originalRevision: original.revision,
                  comments: m.commentStore,
                  storeType: props.store.interactionStore.selectedView.storeType,
                  originalStoreType: VersionControlStoreType.Main,
                },
              });
            }}
          >
            Diff to Main
          </button>
        ) : null}

        {file.history.map((h, idx) => (
          <div key={idx}>
            <button
              onClick={() => {
                if (selected.indexOf(idx) > -1) {
                  setSelected(selected.filter((i) => i !== idx));
                } else {
                  setSelected(selected.concat(idx));
                }
              }}
            >
              {selected.indexOf(idx) > -1 ? "deselect" : "select"}
            </button>
            <ViewButton
              dispatch={props.dispatch}
              history={h}
              readOnly={isReadonly(props.store, selectedView.fullPath, h.fileState.revision)}
              storeType={selectedView.storeType}
            ></ViewButton>

            <FileHistoryItem history={h} selectedView={selectedView} />
          </div>
        ))}

        {selected.length == 2 && (
          <React.Fragment>
            <button
              onClick={() => {
                const m = file.history[selected[1]].fileState;
                const original = file.history[selected[0]].fileState;
                props.dispatch({
                  type: "selectedView",
                  selectedView: {
                    type: "diff",
                    fullPath: file.fullPath,
                    label: `base:${original.revision} v other:${m.revision}`,
                    text: m.text,
                    readOnly: isReadonly(props.store, selectedView.fullPath, m.revision),
                    revision: m.revision,
                    original: original.text,
                    originalRevision: original.revision,
                    comments: m.commentStore,
                    storeType: props.store.interactionStore.selectedView.storeType,
                    originalStoreType: props.store.interactionStore.selectedView.storeType,
                  },
                });
              }}
            >
              diff
            </button>
            <button
              onClick={() => {
                setSelected([]);

                const m = file.history.filter((h) => h.fileState.revision === selectedView.revision)[0]?.fileState;

                props.dispatch({
                  type: "selectedView",
                  selectedView: {
                    type: "view",
                    fullPath: file.fullPath,
                    readOnly: isReadonly(props.store, selectedView.fullPath, m.revision),
                    text: m.text,
                    revision: m.revision,
                    comments: m.commentStore,
                    storeType: props.store.interactionStore.selectedView.storeType,
                  },
                });
              }}
            >
              clear
            </button>
          </React.Fragment>
        )}
      </div>
    );
  }
  return null;
};

const ViewButton: React.FunctionComponent<{
  dispatch: Dispatch;
  history: FileStateHistory;
  storeType: VersionControlStoreType;
  readOnly: boolean;
}> = (props) => {
  return (
    <button
      onClick={() =>
        props.dispatch({
          type: "selectedView",
          selectedView: {
            type: "view",
            fullPath: props.history.fileState.fullPath,
            readOnly: props.readOnly,
            text: props.history.fileState.text,
            comments: props.history.fileState.commentStore,
            revision: props.history.fileState.revision,
            storeType: props.storeType,
          },
        })
      }
    >
      view
    </button>
  );
};
