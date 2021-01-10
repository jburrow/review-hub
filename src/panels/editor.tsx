import { DiffEditor, ControlledEditor } from "@monaco-editor/react";
import { createReviewManager, ReviewManager, ReviewCommentEvent } from "monaco-review";
import * as React from "react";
import { Dispatch, VersionControlStoreType, versionControlStoreTypeLabel } from "../store";
import { SelectedView } from "../interaction-store";
import { RenameDialog } from "../dialogs/rename";
import { Button, Chip } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { ConfirmDialog } from "../dialogs/confirm";

export const Editor = (props: { currentUser: string; view: SelectedView; dispatch: Dispatch }) => {
  const [text, setText] = React.useState<string>(null);
  const [e, setE] = React.useState<any>(null);
  const [comments, setComments] = React.useState<ReviewCommentEvent[]>(null);
  const [reviewManager, setReviewManager] = React.useState<ReviewManager>(null);

  React.useEffect(() => {
    if (props.view) {
      setText(props.view.text);
      setComments([]);
    }
  }, [props.view]);

  React.useEffect(() => {
    console.debug("load comments", props.view?.comments?.comments);
    if (reviewManager !== null && props.view) {
      reviewManager.loadFromStore(
        props.view.comments || {
          comments: {},
          deletedCommentIds: new Set(),
          dirtyCommentIds: new Set(),
        },
        []
      );
    }
  }, [reviewManager, props.view]);

  function setEditor(editor) {
    setE(editor);
    //: monaco.editor.IStandaloneCodeEditor
    const rm = createReviewManager(editor, props.currentUser, [], setComments);
    setReviewManager(rm);
  }

  const [renameDialogOpen, setRenameDialogOpen] = React.useState<boolean>(false);

  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState<boolean>(false);

  const editorHeight = "calc(100% - 25px)";

  return props.view && props.view.fullPath ? (
    <div style={{ height: "calc(100% - 20px)" }}>
      {props.view.readOnly ? (
        <Chip label="READ-ONLY" color="primary" size="small" />
      ) : (
        <Chip label="EDITABLE" color="secondary" size="small" />
      )}

      {props.view.type === "diff" && (
        <Chip
          label={versionControlStoreTypeLabel(props.view.originalStoreType)}
          color="secondary"
          size="small"
          variant="outlined"
        />
      )}
      <Chip
        label={versionControlStoreTypeLabel(props.view.storeType)}
        color="secondary"
        size="small"
        variant="outlined"
      />

      {!props.view.readOnly && (
        <React.Fragment>
          <Button
            aria-label="delete"
            size="small"
            disabled={text !== props.view.text}
            onClick={() => {
              setConfirmDialogOpen(true);
            }}
            startIcon={<DeleteIcon fontSize="small" />}
          >
            Stage - Delete
          </Button>

          <Button
            size="small"
            disabled={text !== props.view.text}
            onClick={() => {
              setRenameDialogOpen(true);
            }}
          >
            stage - rename
          </Button>
        </React.Fragment>
      )}

      <RenameDialog
        fullPath={props.view.fullPath}
        onClose={({ newFullPath, rename }) => {
          setRenameDialogOpen(false);
          rename &&
            props.dispatch({
              storeType: VersionControlStoreType.Working,
              type: "commit",
              author: props.currentUser,
              events: [
                {
                  type: "rename",
                  oldFullPath: props.view.fullPath,
                  text: text,
                  fullPath: newFullPath,
                  revision: props.view.revision,
                },
              ],
            });
        }}
        open={renameDialogOpen}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Confirm Delete"
        message={`Do you wish to stage the deletion '${props.view.fullPath}' ?`}
        onClose={(confirm) => {
          setConfirmDialogOpen(false);

          confirm &&
            props.dispatch({
              storeType: VersionControlStoreType.Working,
              type: "commit",
              author: props.currentUser,
              events: [
                {
                  type: "delete",
                  fullPath: props.view.fullPath,
                  revision: props.view.revision,
                },
              ],
            });
        }}
      />

      {text !== props.view.text && (
        <React.Fragment>
          <Button
            size="small"
            onClick={() => {
              props.dispatch({
                storeType: VersionControlStoreType.Working,
                type: "commit",
                author: props.currentUser,
                events: [
                  {
                    type: "edit",
                    fullPath: props.view.fullPath,
                    text: text,
                    revision: props.view.revision,
                  },
                ],
              });
            }}
          >
            stage - change
          </Button>
          <Button
            size="small"
            onClick={() => {
              setText(props.view.text);
              e.getModel().setValue(props.view.text);
            }}
          >
            undo change
          </Button>
        </React.Fragment>
      )}

      {(comments || []).length > 0 && (
        <React.Fragment>
          <Button
            size="small"
            onClick={() => {
              props.dispatch({
                storeType: VersionControlStoreType.Working,
                type: "commit",
                author: props.currentUser,
                events: [
                  {
                    type: "comment",
                    fullPath: props.view.fullPath,
                    commentEvents: comments,
                    revision: props.view.revision,
                  },
                ],
              });
              setComments([]);
            }}
          >
            Stage Comments {`${comments.length}`}
          </Button>

          <Button
            size="small"
            onClick={() => {
              setComments([]);
              reviewManager.loadFromStore(
                props.view.comments || {
                  comments: {},
                  deletedCommentIds: new Set(),
                  dirtyCommentIds: new Set(),
                },
                []
              );
            }}
          >
            Discard Comments
          </Button>
        </React.Fragment>
      )}
      {props.view.type == "diff" ? (
        <DiffEditor
          editorDidMount={(_modified, _original, editor) => {
            editor.getModifiedEditor().onDidChangeModelContent(() => setText(editor.getModifiedEditor().getValue()));
            setEditor(editor.getModifiedEditor());
          }}
          options={{ originalEditable: false, readOnly: props.view.readOnly }}
          language={"javascript"} //TODO - work out how to do lanuage
          height={editorHeight} //TODO - hack work out how to set the hieght
          modified={props.view.text}
          original={props.view.original}
        />
      ) : (
        <ControlledEditor
          value={props.view.text}
          height={editorHeight}
          language={"javascript"} //TODO - work out how to do lanuage
          options={{ readOnly: props.view.readOnly }}
          editorDidMount={(_, editor) => {
            setEditor(editor);
          }}
          onChange={(e, t) => setText(t)}
        />
      )}
    </div>
  ) : null;
};
