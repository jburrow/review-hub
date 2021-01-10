import * as React from "react";
import { AppState, Dispatch, getFile, VersionControlStoreType } from "../store";
import { FileState, FileStateX, FileStateHistory, isReadonly } from "../events-version-control";
import { Button, withStyles, WithStyles } from "@material-ui/core";
import { SelectedStyles } from "../styles";
import { SelectedView } from "../interaction-store";

export const FileHistory = withStyles(SelectedStyles)(
  (
    props: {
      dispatch: Dispatch;
      store: AppState;
    } & WithStyles<typeof SelectedStyles>
  ) => {
    const [selected, setSelected] = React.useState<number[]>([]);

    const file = props.store.vcStore.files[props.store.interactionStore.selectedView?.fullPath];
    const selectedView = props.store.interactionStore.selectedView;

    const convert = (e: FileStateX) => {
      const comments = e.commentStore?.comments || {};

      return (
        <span>
          <span
            className={selectedView?.revision === e.revision ? props.classes.selectedItem : props.classes.inactiveItem}
          >
            v{e.revision}
          </span>{" "}
          <span>{Object.values(comments).length}</span>{" "}
          <div style={{ fontSize: 10 }}>"{e.text?.substring(0, 35)} ..."</div>
        </span>
      );
    };

    if (file) {
      return (
        <div>
          {props.store.mainStore && props.store.interactionStore.selectedView ? (
            <Button
              size="small"
              onClick={() => {
                const m = getFile(
                  props.store,
                  props.store.interactionStore.selectedView.storeType,
                  props.store.interactionStore.selectedView.fullPath
                );
                const original = getFile(
                  props.store,
                  VersionControlStoreType.Main,
                  props.store.interactionStore.selectedView.fullPath
                );
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
                    storeType: props.store.interactionStore.selectedView.storeType, //TODO: should store type be associated with to original - or primary?
                    originalStoreType: props.store.interactionStore.selectedView.storeType, //TODO: should store type be associated with to original - or primary?
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
              ></ViewButton>

              {convert(h.fileState)}
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
                      storeType: VersionControlStoreType.Branch, //TODO: wrong - figure out
                      originalStoreType: VersionControlStoreType.Branch, //TODO:
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
                      storeType: VersionControlStoreType.Branch, //TODO: check if this is what is right
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
            storeType: VersionControlStoreType.Branch, //TODO: Wrong - should be passed in
          },
        })
      }
    >
      view
    </Button>
  );
};
