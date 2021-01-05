"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectEditButton = exports.SelectCommitButton = exports.renderCommentEvent = exports.renderFileEvent = exports.VCHistory = void 0;
const React = require("react");
const events_version_control_1 = require("../events-version-control");
const styles_1 = require("../styles");
const core_1 = require("@material-ui/core");
const VCHistory = (props) => {
    const scid = props.selectedCommitId
        ? props.selectedCommitId
        : props.vcStore.headCommitId;
    const elements = props.vcStore.events
        .filter((e) => e.type === "commit")
        .map((ce, idx) => {
        return (React.createElement("div", { key: idx },
            React.createElement(exports.SelectCommitButton, { commitId: ce.id, dispatch: props.dispatch, selected: scid === ce.id }),
            ce.events.map((e, idx) => (React.createElement("div", { key: idx },
                exports.renderFileEvent(e),
                (e.type === "edit" ||
                    e.type == "comment" ||
                    e.type == "rename") && (React.createElement(exports.SelectEditButton, { commitId: ce.id, selectedView: props.selectedView, vcStore: props.vcStore, dispatch: props.dispatch, editEvent: e }))))),
            React.createElement(core_1.Divider, null)));
    });
    return React.createElement("div", null, elements);
};
exports.VCHistory = VCHistory;
const renderFileEvent = (e) => {
    switch (e.type) {
        case "comment":
            return (React.createElement("ul", null,
                "Comments:",
                e.commentEvents.map((c, idx) => (React.createElement("li", { key: idx }, exports.renderCommentEvent(c))))));
        default:
            return (React.createElement(core_1.Chip, { label: `${e.type} - ${e.fullPath} @ ${e.revision}` }));
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
    React.createElement("span", { className: props.selected
            ? props.classes.selectedItem
            : props.classes.inactiveItem }, props.commitId))));
exports.SelectEditButton = core_1.withStyles(styles_1.SelectedStyles)((props) => {
    var _a, _b;
    //Dodgy
    const selected = (props.editEvent.type === "comment" || //TODO - pull this out into a 'types with filename'
        props.editEvent.type === "edit" ||
        props.editEvent.type === "rename" ||
        props.editEvent.type === "delete") &&
        props.vcStore.commits[props.commitId] &&
        ((_a = props.selectedView) === null || _a === void 0 ? void 0 : _a.fullPath) == props.editEvent.fullPath &&
        ((_b = props.selectedView) === null || _b === void 0 ? void 0 : _b.revision) ==
            props.vcStore.commits[props.commitId][props.editEvent.fullPath]
                .revision;
    return (React.createElement(React.Fragment, null,
        React.createElement(core_1.Button, { size: "small", style: { marginLeft: 50 }, onClick: () => {
                if (
                //Dodgy
                props.editEvent.type === "comment" ||
                    props.editEvent.type === "edit" ||
                    props.editEvent.type === "rename" ||
                    props.editEvent.type === "delete") {
                    const f = props.vcStore.commits[props.commitId][props.editEvent.fullPath];
                    props.dispatch({
                        type: "selectCommit",
                        commitId: props.commitId,
                    });
                    props.dispatch({
                        type: "selectedView",
                        fullPath: f.fullPath,
                        revision: f.revision,
                        readOnly: events_version_control_1.isReadonly(props.vcStore.files[f.fullPath].history, f.revision),
                        text: f.text,
                    });
                }
            } }, "View Revision"),
        selected && (React.createElement("span", { className: selected ? props.classes.selectedItem : props.classes.inactiveItem }, "Selected"))));
});
//# sourceMappingURL=vc-history.js.map