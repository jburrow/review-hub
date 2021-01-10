"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Editor = void 0;
const react_1 = require("@monaco-editor/react");
const monaco_review_1 = require("monaco-review");
const React = require("react");
const store_1 = require("../store");
const rename_1 = require("../dialogs/rename");
const core_1 = require("@material-ui/core");
const Delete_1 = require("@material-ui/icons/Delete");
const confirm_1 = require("../dialogs/confirm");
const Editor = (props) => {
    const [text, setText] = React.useState(null);
    const [e, setE] = React.useState(null);
    const [comments, setComments] = React.useState(null);
    const [reviewManager, setReviewManager] = React.useState(null);
    React.useEffect(() => {
        if (props.view) {
            setText(props.view.text);
            setComments([]);
        }
    }, [props.view]);
    React.useEffect(() => {
        var _a, _b;
        console.debug("load comments", (_b = (_a = props.view) === null || _a === void 0 ? void 0 : _a.comments) === null || _b === void 0 ? void 0 : _b.comments);
        if (reviewManager !== null && props.view) {
            reviewManager.loadFromStore(props.view.comments || {
                comments: {},
                deletedCommentIds: new Set(),
                dirtyCommentIds: new Set(),
            }, []);
        }
    }, [reviewManager, props.view]);
    function setEditor(editor) {
        setE(editor);
        //: monaco.editor.IStandaloneCodeEditor
        const rm = monaco_review_1.createReviewManager(editor, props.currentUser, [], setComments);
        setReviewManager(rm);
    }
    const [renameDialogOpen, setRenameDialogOpen] = React.useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
    const editorHeight = "calc(100% - 25px)";
    return props.view && props.view.fullPath ? (React.createElement("div", { style: { height: "calc(100% - 20px)" } },
        props.view.readOnly ? (React.createElement(core_1.Chip, { label: "READ-ONLY", color: "primary", size: "small" })) : (React.createElement(core_1.Chip, { label: "EDITABLE", color: "secondary", size: "small" })),
        props.view.type === "diff" && (React.createElement(core_1.Chip, { label: store_1.versionControlStoreTypeLabel(props.view.originalStoreType), color: "secondary", size: "small", variant: "outlined" })),
        React.createElement(core_1.Chip, { label: store_1.versionControlStoreTypeLabel(props.view.storeType), color: "secondary", size: "small", variant: "outlined" }),
        !props.view.readOnly && (React.createElement(React.Fragment, null,
            React.createElement(core_1.Button, { "aria-label": "delete", size: "small", disabled: text !== props.view.text, onClick: () => {
                    setConfirmDialogOpen(true);
                }, startIcon: React.createElement(Delete_1.default, { fontSize: "small" }) }, "Stage - Delete"),
            React.createElement(core_1.Button, { size: "small", disabled: text !== props.view.text, onClick: () => {
                    setRenameDialogOpen(true);
                } }, "stage - rename"))),
        React.createElement(rename_1.RenameDialog, { fullPath: props.view.fullPath, onClose: ({ newFullPath, rename }) => {
                setRenameDialogOpen(false);
                rename &&
                    props.dispatch({
                        storeType: store_1.VersionControlStoreType.Working,
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
            }, open: renameDialogOpen }),
        React.createElement(confirm_1.ConfirmDialog, { open: confirmDialogOpen, title: "Confirm Delete", message: `Do you wish to stage the deletion '${props.view.fullPath}' ?`, onClose: (confirm) => {
                setConfirmDialogOpen(false);
                confirm &&
                    props.dispatch({
                        storeType: store_1.VersionControlStoreType.Working,
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
            } }),
        text !== props.view.text && (React.createElement(React.Fragment, null,
            React.createElement(core_1.Button, { size: "small", onClick: () => {
                    props.dispatch({
                        storeType: store_1.VersionControlStoreType.Working,
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
                } }, "stage - change"),
            React.createElement(core_1.Button, { size: "small", onClick: () => {
                    setText(props.view.text);
                    e.getModel().setValue(props.view.text);
                } }, "undo change"))),
        (comments || []).length > 0 && (React.createElement(React.Fragment, null,
            React.createElement(core_1.Button, { size: "small", onClick: () => {
                    props.dispatch({
                        storeType: store_1.VersionControlStoreType.Working,
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
                } },
                "Stage Comments ",
                `${comments.length}`),
            React.createElement(core_1.Button, { size: "small", onClick: () => {
                    setComments([]);
                    reviewManager.loadFromStore(props.view.comments || {
                        comments: {},
                        deletedCommentIds: new Set(),
                        dirtyCommentIds: new Set(),
                    }, []);
                } }, "Discard Comments"))),
        props.view.type == "diff" ? (React.createElement(react_1.DiffEditor, { editorDidMount: (_modified, _original, editor) => {
                editor.getModifiedEditor().onDidChangeModelContent(() => setText(editor.getModifiedEditor().getValue()));
                setEditor(editor.getModifiedEditor());
            }, options: { originalEditable: false, readOnly: props.view.readOnly }, language: "javascript", height: editorHeight, modified: props.view.text, original: props.view.original })) : (React.createElement(react_1.ControlledEditor, { value: props.view.text, height: editorHeight, language: "javascript", options: { readOnly: props.view.readOnly }, editorDidMount: (_, editor) => {
                setEditor(editor);
            }, onChange: (e, t) => setText(t) })))) : null;
};
exports.Editor = Editor;
//# sourceMappingURL=editor.js.map