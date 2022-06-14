"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectEditButton = exports.SelectCommitButton = exports.renderCommentEvent = exports.Chip = exports.renderFileEvent = exports.VersionControlCommitEventComponent = exports.Timeline = void 0;
const React = require("react");
const store_1 = require("../store");
const styles_1 = require("../styles");
const Timeline = (props) => {
    const scid = props.selectedCommitId ? props.selectedCommitId : props.store.vcStore.headCommitId;
    const elements = props.store.vcStore.events.map((ce, idx) => {
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
            (0, exports.renderFileEvent)(e),
            (e.type === "edit" || e.type == "comment" || e.type == "rename") && (React.createElement(exports.SelectEditButton, { commitId: props.ce.id, selectedView: props.selectedView, store: props.store, dispatch: props.dispatch, editEvent: e }))))),
        React.createElement("hr", null)));
};
exports.VersionControlCommitEventComponent = VersionControlCommitEventComponent;
const renderFileEvent = (e) => {
    switch (e.type) {
        case "comment":
            return (React.createElement("ul", null,
                "Comments:",
                e.commentEvents.map((c, idx) => (React.createElement("li", { key: idx }, (0, exports.renderCommentEvent)(c))))));
        default:
            return React.createElement(exports.Chip, { label: `${e.type} - ${e.fullPath} @ ${e.revision}` });
    }
};
exports.renderFileEvent = renderFileEvent;
const Chip = (props) => {
    return React.createElement("div", null, props.label);
};
exports.Chip = Chip;
const renderCommentEvent = (e) => {
    switch (e.type) {
        case "create":
            return (React.createElement("div", null,
                e.text,
                " by ",
                e.createdBy));
        default:
            return React.createElement(exports.Chip, { label: e.type });
    }
};
exports.renderCommentEvent = renderCommentEvent;
const SelectCommitButton = (props) => (React.createElement(React.Fragment, null,
    React.createElement("button", { onClick: () => {
            props.dispatch({ type: "selectCommit", commitId: props.commitId });
        } }, "Select Commit"),
    React.createElement("span", { style: props.selected ? styles_1.SelectedStyles.selectedItem : styles_1.SelectedStyles.inactiveItem }, props.commitId)));
exports.SelectCommitButton = SelectCommitButton;
const SelectEditButton = (props) => {
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
        React.createElement("button", { style: { marginLeft: 50 }, onClick: () => {
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
                            readOnly: (0, store_1.isReadonly)(props.store, f.fullPath, f.revision),
                            text: f.text,
                            storeType: store_1.VersionControlStoreType.Branch,
                        },
                    });
                }
            } }, "View Revision"),
        selected && React.createElement("span", { style: selected ? styles_1.SelectedStyles.selectedItem : styles_1.SelectedStyles.inactiveItem }, "Selected")));
};
exports.SelectEditButton = SelectEditButton;
//# sourceMappingURL=timeline.js.map