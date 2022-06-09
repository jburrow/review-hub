"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectEditButton = exports.SelectCommitButton = exports.renderCommentEvent = exports.renderFileEvent = exports.VersionControlCommitEventComponent = exports.Timeline = void 0;
const React = require("react");
const store_1 = require("../store");
const styles_1 = require("../styles");
const core_1 = require("@material-ui/core");
const Timeline = (props) => {
    const scid = props.selectedCommitId ? props.selectedCommitId : props.store.vcStore.headCommitId;
    const elements = props.store.vcStore.events.map((ce, idx) => {
        console.log("x:X", ce);
        switch (ce.type) {
            case "information":
                return React.createElement("div", { key: idx }, ce.message);
            case "commit":
                return (React.createElement(exports.VersionControlCommitEventComponent, { key: idx, ce: ce, selectedView: props.selectedView, idx: idx, scid: scid, store: props.store, dispatch: props.dispatch }));
        }
    });
    return React.createElement("div", null, elements);
};
exports.Timeline = Timeline;
const VersionControlCommitEventComponent = (props) => {
    return (React.createElement("div", null,
        React.createElement(exports.SelectCommitButton, { commitId: props.ce.id, dispatch: props.dispatch, selected: props.scid === props.ce.id }),
        props.ce.events.map((e, idx) => (React.createElement("div", { key: idx },
            exports.renderFileEvent(e),
            (e.type === "edit" || e.type == "comment" || e.type == "rename") && (React.createElement(exports.SelectEditButton, { commitId: props.ce.id, selectedView: props.selectedView, store: props.store, dispatch: props.dispatch, editEvent: e }))))),
        React.createElement(core_1.Divider, null)));
};
exports.VersionControlCommitEventComponent = VersionControlCommitEventComponent;
const renderFileEvent = (e) => {
    switch (e.type) {
        case "comment":
            return (React.createElement("ul", null,
                "Comments:",
                e.commentEvents.map((c, idx) => (React.createElement("li", { key: idx }, exports.renderCommentEvent(c))))));
        default:
            return React.createElement(core_1.Chip, { label: `${e.type} - ${e.fullPath} @ ${e.revision}` });
    }
};
exports.renderFileEvent = renderFileEvent;
const renderCommentEvent = (e) => {
    switch (e.type) {
        case "create":
            return (React.createElement("div", null,
                e.text,
                " by ",
                e.createdBy));
        default:
            return React.createElement(core_1.Chip, { label: e.type });
    }
};
exports.renderCommentEvent = renderCommentEvent;
exports.SelectCommitButton = core_1.withStyles(styles_1.SelectedStyles)((props) => (React.createElement(React.Fragment, null,
    React.createElement(core_1.Button, { size: "small", onClick: () => {
            props.dispatch({ type: "selectCommit", commitId: props.commitId });
        } }, "Select Commit"),
    React.createElement("span", { className: props.selected ? props.classes.selectedItem : props.classes.inactiveItem }, props.commitId))));
exports.SelectEditButton = core_1.withStyles(styles_1.SelectedStyles)((props) => {
    var _a, _b;
    //Dodgy
    const selected = (props.editEvent.type === "comment" || //TODO - pull this out into a 'types with filename'
        props.editEvent.type === "edit" ||
        props.editEvent.type === "rename" ||
        props.editEvent.type === "delete") &&
        props.store.vcStore.commits[props.commitId] &&
        ((_a = props.selectedView) === null || _a === void 0 ? void 0 : _a.fullPath) == props.editEvent.fullPath &&
        ((_b = props.selectedView) === null || _b === void 0 ? void 0 : _b.revision) == props.store.vcStore.commits[props.commitId][props.editEvent.fullPath].revision;
    return (React.createElement(React.Fragment, null,
        React.createElement(core_1.Button, { size: "small", style: { marginLeft: 50 }, onClick: () => {
                if (
                //Dodgy
                props.editEvent.type === "comment" ||
                    props.editEvent.type === "edit" ||
                    props.editEvent.type === "rename" ||
                    props.editEvent.type === "delete") {
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
                            readOnly: store_1.isReadonly(props.store, f.fullPath, f.revision),
                            text: f.text,
                            storeType: store_1.VersionControlStoreType.Branch,
                        },
                    });
                }
            } }, "View Revision"),
        selected && (React.createElement("span", { className: selected ? props.classes.selectedItem : props.classes.inactiveItem }, "Selected"))));
});
//# sourceMappingURL=timeline.js.map