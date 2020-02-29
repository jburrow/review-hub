import { DiffEditor, ControlledEditor } from "@monaco-editor/react";
import {
  createReviewManager,
  ReviewManager,
  ReviewCommentEvent
} from "monaco-review";
import * as React from "react";
import { Dispatch, VersionControlStoreType } from "../store";
import { SelectedView } from "../interaction-store";

export const Editor = (props: {
  currentUser: string;
  view: SelectedView;
  dispatch: Dispatch;
}) => {
  const [text, setText] = React.useState<string>(null);
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
          dirtyCommentIds: new Set()
        },
        []
      );
    }
  }, [reviewManager, props.view]);

  function setEditor(editor) {
    //: monaco.editor.IStandaloneCodeEditor
    const rm = createReviewManager(editor, props.currentUser, [], setComments);
    setReviewManager(rm);
  }

  const editorHeight = "calc(100% - 25px)";

  return props.view && props.view.fullPath ? (
    <div style={{ height: "calc(100% - 20px)" }}>
      <span>
        * {props.view?.fullPath} - {props.view?.revision} - {props.view?.label}-{" "}
        {props.view.readOnly ? (
          <span style={{ backgroundColor: "red" }}>READ-ONLY</span>
        ) : (
          <span style={{ backgroundColor: "green" }}>EDITABLE</span>
        )}
        *
      </span>

      <button
        onClick={() => {
          props.dispatch({
            storeType: VersionControlStoreType.Working,
            type: "commit",
            author: props.currentUser,
            events: [{ type: "delete", fullPath: props.view.fullPath }]
          });
        }}
      >
        stage - delete
      </button>
      <button
        onClick={() => {
          props.dispatch({
            storeType: VersionControlStoreType.Working,
            type: "commit",
            author: props.currentUser,
            events: [
              {
                type: "rename",
                oldFullPath: props.view.fullPath,
                text: text,
                fullPath: props.view.fullPath + ".renamed"
              }
            ]
          });
        }}
      >
        stage - rename
      </button>
      {text !== props.view.text ? (
        <button
          onClick={() => {
            props.dispatch({
              storeType: VersionControlStoreType.Working,
              type: "commit",
              author: props.currentUser,
              events: [
                { type: "edit", fullPath: props.view.fullPath, text: text }
              ]
            });
          }}
        >
          stage - change
        </button>
      ) : (
        <span>not modified text</span>
      )}

      {(comments || []).length ? (
        <button
          onClick={() => {
            props.dispatch({
              storeType: VersionControlStoreType.Working,
              type: "commit",
              author: props.currentUser,
              events: [
                {
                  type: "comment",
                  fullPath: props.view.fullPath,
                  commentEvents: comments
                }
              ]
            });
            setComments([]);
          }}
        >
          Stage Comments {`${comments.length}`}
        </button>
      ) : (
        <span>not modified comments</span>
      )}

      {(comments || []).length && (
        <button
          onClick={() => {
            setComments([]);
            reviewManager.loadFromStore(
              props.view.comments || {
                comments: {},
                deletedCommentIds: new Set(),
                dirtyCommentIds: new Set()
              },
              []
            );
          }}
        >
          Discard Comments
        </button>
      )}

      {props.view.original ? (
        <DiffEditor
          editorDidMount={(_modified, _original, editor) => {
            editor
              .getModifiedEditor()
              .onDidChangeModelContent(() =>
                setText(editor.getModifiedEditor().getValue())
              );
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
