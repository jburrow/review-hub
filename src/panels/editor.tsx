import { DiffEditor, ControlledEditor } from "@monaco-editor/react";
import {
  createReviewManager,
  ReviewManager,
  ReviewCommentEvent
} from "monaco-review";
import * as React from "react";
import { SelectedView } from "../store";
import { VersionControlEvent } from "../events-version-control";

export const Editor = (props: {
  currentUser: string;
  view: SelectedView;
  wsDispatch(e: VersionControlEvent): void;
}) => {
  const [text, setText] = React.useState<string>(null);
  const [comments, setComments] = React.useState<ReviewCommentEvent[]>(null);
  const [reviewManager, setReviewManager] = React.useState<ReviewManager>(null);

  React.useEffect(() => {
    console.debug("load view", props.view?.text, props.view?.original);
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

  return props.view && props.view.fullPath ? (
    <div>
      {text !== props.view.text ? (
        <button
          onClick={() => {
            props.wsDispatch({
              type: "commit",
              author: props.currentUser,
              events: [
                { type: "edit", fullPath: props.view.fullPath, text: text }
              ]
            });
          }}
        >
          Stage Change
        </button>
      ) : (
        <div>not modified text</div>
      )}

      {(comments || []).length ? (
        <button
          onClick={() => {
            props.wsDispatch({
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
        <div>not modified comments</div>
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
          options={{ originalEditable: false }}
          language={"javascript"}
          height={200}
          modified={props.view.text}
          original={props.view.original}
        />
      ) : (
        <ControlledEditor
          value={props.view.text}
          height={200}
          options={{ readOnly: false }}
          editorDidMount={(_, editor) => {
            setEditor(editor);
          }}
          onChange={(e, t) => setText(t)}
        />
      )}
    </div>
  ) : null;
};
