"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCMPanel = exports.SCM = exports.StagingSCM = void 0;
const React = require("react");
const store_1 = require("../store");
const events_version_control_1 = require("../events-version-control");
const core_1 = require("@material-ui/core");
const styles_1 = require("../styles");
const uuid_1 = require("uuid");
const text_input_1 = require("../dialogs/text-input");
const StagingSCM = (props) => {
    const [generalCommentOpen, setGeneralCommentOpen] = React.useState(false);
    const [newFileOpen, setNewFileOpen] = React.useState(false);
    return (React.createElement("div", null,
        React.createElement(core_1.Tooltip, { title: "Changes that have not been merged to main" },
            React.createElement("h3", null, "Working set")),
        React.createElement(exports.SCM, { dispatch: props.dispatch, currentUser: props.currentUser, files: props.wsfiles, comments: props.generalComments, selectedFile: props.selectedFile }),
        React.createElement(core_1.Button, { size: "small", onClick: () => {
                setNewFileOpen(true);
            } }, "Create New File"),
        React.createElement(core_1.Button, { size: "small", onClick: () => {
                setGeneralCommentOpen(true);
            }, disabled: props.isHeadCommit }, "Comment"),
        React.createElement(core_1.Button, { size: "small", variant: "contained", color: "primary", onClick: () => {
                const events = props.events
                    .filter((e) => e.type === "commit")
                    .reduce((acc, e) => {
                    if (e.type === "commit") {
                        return acc.concat(e.events);
                    }
                    else {
                        return acc;
                    }
                }, []);
                props.dispatch({
                    storeType: store_1.VersionControlStoreType.VersionControl,
                    type: "commit",
                    author: props.currentUser,
                    id: uuid_1.v4(),
                    events: events,
                });
            }, disabled: props.events.length == 0 }, "Save All"),
        React.createElement(core_1.Button, { size: "small", onClick: () => {
                props.dispatch({
                    type: "reset",
                    storeType: store_1.VersionControlStoreType.Working,
                });
            }, disabled: props.events.length == 0 }, "Discard Changes"),
        React.createElement(text_input_1.TextInputDialog, { open: generalCommentOpen, title: "Enter general comment", onClose: (c) => {
                setGeneralCommentOpen(false);
                c.confirm &&
                    props.dispatch({
                        type: "commit",
                        storeType: store_1.VersionControlStoreType.Working,
                        author: props.currentUser,
                        id: uuid_1.v4(),
                        events: [
                            {
                                type: "general-comment",
                                commentEvents: [
                                    {
                                        type: "create",
                                        text: c.text,
                                        lineNumber: 0,
                                        createdAt: "",
                                        createdBy: props.currentUser,
                                        id: uuid_1.v4(),
                                        targetId: null,
                                    },
                                ],
                            },
                        ],
                    });
            } }),
        React.createElement(text_input_1.TextInputDialog, { open: newFileOpen, title: "Create a new file", onClose: (c) => {
                setNewFileOpen(false);
                c.confirm &&
                    props.dispatch({
                        type: "commit",
                        storeType: store_1.VersionControlStoreType.Working,
                        author: props.currentUser,
                        id: uuid_1.v4(),
                        events: [
                            {
                                type: "edit",
                                fullPath: c.text,
                                text: "",
                                revision: 0,
                            },
                        ],
                    });
            } })));
};
exports.StagingSCM = StagingSCM;
const SCM = (props) => {
    const [textInputOpen, setTextInputOpen] = React.useState(false);
    const [messageId, setMessageId] = React.useState(null);
    const handleClick = (fullPath) => {
        const value = props.files[fullPath];
        props.dispatch({
            type: "selectedView",
            fullPath: value.fullPath,
            readOnly: events_version_control_1.isReadonly(value.history, value.revision),
            text: value.text,
            comments: value.commentStore,
            revision: value.revision,
        });
    };
    const filteredItems = props.filter
        ? Object.entries(props.files).filter(props.filter)
        : Object.entries(props.files);
    const items = filteredItems.map(([, value]) => (React.createElement(SCMItem, { key: value.fullPath, fullPath: value.fullPath, revision: value.revision.toString(), status: value.status, onClick: handleClick, selected: props.selectedFile === value.fullPath })));
    const renderedCommentIds = new Set();
    const onReply = (messageId) => {
        setMessageId(messageId);
        setTextInputOpen(true);
    };
    const comments = Object.values(props.comments.comments)
        .filter((v) => v.comment.parentId === null)
        .map((v) => (React.createElement(Comment, { onReply: onReply, key: v.comment.id, comment: v, comments: props.comments.comments, depth: 0, dispatch: props.dispatch })));
    //Finds all the comments that are already rendered [ replies without parents ]
    const recurseComments = (cs, fn) => {
        cs.filter(fn).map((c) => {
            renderedCommentIds.add(c.comment.id);
            recurseComments(cs, (cc) => cc.comment.parentId == c.comment.id);
        });
    };
    recurseComments(Object.values(props.comments.comments), (v) => v.comment.parentId === null);
    const notRenderedIds = Object.values(props.comments.comments).filter((c) => !renderedCommentIds.has(c.comment.id));
    const replyComments = notRenderedIds.map((cs) => (React.createElement(Comment, { onReply: null, key: cs.comment.id, comment: cs, comments: {}, depth: 0, dispatch: null })));
    const onClose = React.useCallback((c) => {
        setTextInputOpen(false);
        c.confirm &&
            props.dispatch({
                type: "commit",
                storeType: store_1.VersionControlStoreType.Working,
                author: props.currentUser,
                id: uuid_1.v4(),
                events: [
                    {
                        type: "general-comment",
                        commentEvents: [
                            {
                                type: "create",
                                text: c.text,
                                lineNumber: 0,
                                createdAt: new Date().toISOString(),
                                createdBy: props.currentUser,
                                id: uuid_1.v4(),
                                targetId: messageId,
                            },
                        ],
                    },
                ],
            });
    }, [messageId]);
    return (React.createElement("div", null,
        React.createElement("ul", null, items),
        comments.length + replyComments.length ? (React.createElement("h3", null, "General Comments")) : null,
        React.createElement("ul", null, comments.concat(replyComments)),
        React.createElement(text_input_1.TextInputDialog, { open: textInputOpen, title: "Reply to comment", onClose: onClose })));
};
exports.SCM = SCM;
const Comment = (props) => {
    return (React.createElement("li", null,
        props.depth,
        " - ",
        props.comment.comment.text,
        " ",
        props.comment.comment.author,
        " ",
        props.comment.comment.dt,
        React.createElement(core_1.Link, { onClick: () => {
                props.onReply(props.comment.comment.id);
            } }, "reply"),
        React.createElement("ul", null, Object.values(props.comments)
            .filter((c) => c.comment.parentId === props.comment.comment.id)
            .map((c) => (React.createElement(Comment, { onReply: props.onReply, key: c.comment.id, comment: c, comments: props.comments, depth: props.depth + 1, dispatch: props.dispatch }))))));
};
const SCMItem = core_1.withStyles(styles_1.SelectedStyles)((props) => {
    return (React.createElement("li", { style: props.status === 2
            ? { textDecoration: "line-through" }
            : { cursor: "pointer" }, onClick: (e) => {
            props.onClick(props.fullPath);
            e.stopPropagation();
            console.log("here");
        }, className: props.selected
            ? props.classes.selectedItem
            : props.classes.inactiveItem },
        props.fullPath,
        " @ v",
        props.revision,
        " - ",
        props.status));
});
const SCMPanel = (props) => {
    var _a, _b;
    const activeFiles = props.store.interactionStore.selectedCommitId
        ? props.store.vcStore.commits[props.store.interactionStore.selectedCommitId]
        : props.store.vcStore.files;
    return (React.createElement(React.Fragment, null,
        React.createElement(exports.SCM, { dispatch: props.dispatch, files: activeFiles, currentUser: props.store.interactionStore.currentUser, selectedFile: (_a = props.store.interactionStore.selectedView) === null || _a === void 0 ? void 0 : _a.fullPath, comments: props.store.vcStore.commentStore, filter: (i) => {
                return i[1].status === events_version_control_1.FileStateStatus.active;
            } }),
        React.createElement(core_1.Chip, { label: `Events: #${props.store.vcStore.events.length}`, size: "small" }),
        React.createElement(core_1.Divider, null),
        React.createElement(exports.StagingSCM, { dispatch: props.dispatch, isHeadCommit: props.store.isHeadCommit, currentUser: props.store.interactionStore.currentUser, generalComments: props.store.wsStore.commentStore, events: props.store.wsStore.events, wsfiles: props.store.wsStore.files, vcfiles: props.store.vcStore.files, selectedFile: (_b = props.store.interactionStore.selectedView) === null || _b === void 0 ? void 0 : _b.fullPath }),
        React.createElement(core_1.Chip, { label: `Events: #${props.store.wsStore.events.length}`, size: "small" })));
};
exports.SCMPanel = SCMPanel;
//# sourceMappingURL=staging-scm.js.map