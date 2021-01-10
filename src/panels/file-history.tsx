import * as React from "react";
import { Dispatch } from "../store";
import { FileState, FileStateX, FileStateHistory, isReadonly } from "../events-version-control";
import { Button, withStyles, WithStyles } from "@material-ui/core";
import { SelectedStyles } from "../styles";
import { SelectedView } from "../interaction-store";

export const FileHistory = withStyles(SelectedStyles)(
  (
    props: {
      file: FileState;
      selectedView: SelectedView;
      dispatch: Dispatch;
    } & WithStyles<typeof SelectedStyles>
  ) => {
    const [selected, setSelected] = React.useState<number[]>([]);

    const convert = (e: FileStateX) => {
      const comments = e.commentStore?.comments || {};

      return (
        <span>
          <span
            className={
              props.selectedView?.revision === e.revision ? props.classes.selectedItem : props.classes.inactiveItem
            }
          >
            v{e.revision}
          </span>{" "}
          <span>{Object.values(comments).length}</span>{" "}
          <div style={{ fontSize: 10 }}>"{e.text?.substring(0, 35)} ..."</div>
        </span>
      );
    };

    if (props.file) {
      return (
        <div>
          {props.file.history.map((h, idx) => (
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
                readOnly={isReadonly(props.file.history, h.fileState.revision)}
              ></ViewButton>

              {convert(h.fileState)}
            </div>
          ))}
          {selected.length == 2 && (
            <React.Fragment>
              <Button
                size="small"
                onClick={() => {
                  const m = props.file.history[selected[1]].fileState;
                  const original = props.file.history[selected[0]].fileState;
                  props.dispatch({
                    type: "selectedView",
                    fullPath: props.file.fullPath,
                    label: `base:${original.revision} v other:${m.revision}`,
                    text: m.text,
                    readOnly: isReadonly(props.file.history, m.revision),
                    revision: m.revision,
                    original: original.text,
                    originalRevision: original.revision,
                    comments: m.commentStore,
                  });
                }}
              >
                diff
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setSelected([]);

                  const m = props.file.history.filter((h) => h.fileState.revision === props.selectedView.revision)[0]
                    ?.fileState;

                  props.dispatch({
                    type: "selectedView",
                    fullPath: props.file.fullPath,
                    readOnly: isReadonly(props.file.history, m.revision),
                    text: m.text,
                    revision: m.revision,
                    comments: m.commentStore,
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
          fullPath: props.history.fileState.fullPath,
          readOnly: props.readOnly,
          text: props.history.fileState.text,
          comments: props.history.fileState.commentStore,
          revision: props.history.fileState.revision,
        })
      }
    >
      view
    </Button>
  );
};
