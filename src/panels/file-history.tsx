import * as React from "react";
import { AppState, Dispatch, getFile, VersionControlStoreType, versionControlStoreTypeLabel } from "../store";
import { FileStateHistory, isReadonly } from "../events-version-control";
import { Button, Chip, withStyles, WithStyles } from "@material-ui/core";
import { SelectedStyles } from "../styles";
import { SelectedView } from "../interaction-store";

export const FileHistoryItem = withStyles(SelectedStyles)(
  (props: { history: FileStateHistory; selectedView: SelectedView } & WithStyles<typeof SelectedStyles>) => {
    const comments = props.history.fileState.commentStore?.comments || {};

    return (
      <span>
        <span
          className={
            props.selectedView?.revision === props.history.fileState.revision
              ? props.classes.selectedItem
              : props.classes.inactiveItem
          }
        >
          v{props.history.fileState.revision}
        </span>{" "}
        <span>{Object.values(comments).length}</span>{" "}
      </span>
    );
  }
);

export const FileHistory = withStyles(SelectedStyles)(
  (
    props: {
      dispatch: Dispatch;
      store: AppState;
    } & WithStyles<typeof SelectedStyles>
  ) => {
    const [selected, setSelected] = React.useState<number[]>([]);
    const selectedView = props.store.interactionStore.selectedView;
    const file = getFile(props.store, selectedView?.storeType, selectedView?.fullPath)?.file;

    if (file) {
      return (
        <div>
          <Chip label={versionControlStoreTypeLabel(selectedView.storeType)} variant="outlined" />

          {props.store.mainStore &&
          ((props.store.interactionStore.selectedView?.type == "diff" &&
            props.store.interactionStore.selectedView.originalStoreType !== VersionControlStoreType.Main) ||
            (props.store.interactionStore.selectedView?.type == "view" &&
              props.store.interactionStore.selectedView.storeType !== VersionControlStoreType.Main)) ? (
            <Button
              size="small"
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
                  isReadonly(file.history, m.revision) &&
                  props.store.interactionStore.selectedView.storeType !== VersionControlStoreType.Working;
                console.log(readOnly, props.store.interactionStore.selectedView);
                //ebugger;
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
            </Button>
          ) : null}

          {file.history.map((h, idx) => (
            <div key={idx}>
              <Button
                size="small"
                onClick={() => {
                  if (selected.indexOf(idx) > -1) {
                    setSelected(selected.filter((i) => i !== idx));
                  } else {
                    setSelected(selected.concat(idx));
                  }
                }}
              >
                {selected.indexOf(idx) > -1 ? "deselect" : "select"}
              </Button>
              <ViewButton
                dispatch={props.dispatch}
                history={h}
                readOnly={isReadonly(file.history, h.fileState.revision)}
                storeType={selectedView.storeType}
              ></ViewButton>

              <FileHistoryItem history={h} selectedView={selectedView} />
            </div>
          ))}

          {selected.length == 2 && (
            <React.Fragment>
              <Button
                size="small"
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
                      readOnly: isReadonly(file.history, m.revision),
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
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setSelected([]);

                  const m = file.history.filter((h) => h.fileState.revision === selectedView.revision)[0]?.fileState;

                  props.dispatch({
                    type: "selectedView",
                    selectedView: {
                      type: "view",
                      fullPath: file.fullPath,
                      readOnly: isReadonly(file.history, m.revision),
                      text: m.text,
                      revision: m.revision,
                      comments: m.commentStore,
                      storeType: props.store.interactionStore.selectedView.storeType,
                    },
                  });
                }}
              >
                clear
              </Button>
            </React.Fragment>
          )}
        </div>
      );
    }
    return null;
  }
);

const ViewButton: React.FunctionComponent<{
  dispatch: Dispatch;
  history: FileStateHistory;
  storeType: VersionControlStoreType;
  readOnly: boolean;
}> = (props) => {
  return (
    <Button
      size="small"
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
    </Button>
  );
};
