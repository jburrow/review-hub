"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHistory = exports.timeConverter = exports.FileHistoryItem = void 0;
const React = require("react");
const store_1 = require("../store");
const styles_1 = require("../styles");
const timeline_1 = require("./timeline");
const FileHistoryItem = (props) => {
    var _a, _b;
    const comments = ((_a = props.history.fileState.commentStore) === null || _a === void 0 ? void 0 : _a.comments) || {};
    return (React.createElement("span", null,
        React.createElement("span", { style: ((_b = props.selectedView) === null || _b === void 0 ? void 0 : _b.revision) === props.history.fileState.revision
                ? styles_1.SelectedStyles.selectedItem
                : styles_1.SelectedStyles.inactiveItem },
            "v",
            props.history.fileState.revision),
        " ",
        React.createElement("span", null, Object.values(comments).length),
        " ",
        React.createElement("span", null, timeConverter(props.history.event.createdAt))));
};
exports.FileHistoryItem = FileHistoryItem;
function timeConverter(timestamp) {
    if (timestamp) {
        const a = new Date(timestamp);
        const year = a.getFullYear();
        const month = a.getMonth().toString().padStart(2, "0");
        const date = a.getDate().toString().padStart(2, "0");
        const hour = a.getHours().toString().padStart(2, "0");
        const min = a.getMinutes().toString().padStart(2, "0");
        const sec = a.getSeconds().toString().padStart(2, "0");
        return `${year}-${month}-${date} ${hour}:${min}:${sec}`;
    }
    else {
        return "";
    }
}
exports.timeConverter = timeConverter;
const FileHistory = (props) => {
    var _a, _b, _c;
    const [selected, setSelected] = React.useState([]);
    const selectedView = props.store.interactionStore.selectedView;
    const file = (_a = (0, store_1.getFile)(props.store, selectedView === null || selectedView === void 0 ? void 0 : selectedView.storeType, selectedView === null || selectedView === void 0 ? void 0 : selectedView.fullPath)) === null || _a === void 0 ? void 0 : _a.file;
    if (file) {
        return (React.createElement("div", null,
            React.createElement(timeline_1.Chip, { label: (0, store_1.versionControlStoreTypeLabel)(selectedView.storeType) }),
            props.store.mainStore &&
                ((((_b = props.store.interactionStore.selectedView) === null || _b === void 0 ? void 0 : _b.type) == "diff" &&
                    props.store.interactionStore.selectedView.originalStoreType !== store_1.VersionControlStoreType.Main) ||
                    (((_c = props.store.interactionStore.selectedView) === null || _c === void 0 ? void 0 : _c.type) == "view" &&
                        props.store.interactionStore.selectedView.storeType !== store_1.VersionControlStoreType.Main)) ? (React.createElement("button", { onClick: () => {
                    const active = (0, store_1.getFile)(props.store, props.store.interactionStore.selectedView.storeType, props.store.interactionStore.selectedView.fullPath);
                    const m = active.file;
                    const original = (0, store_1.getFile)(props.store, store_1.VersionControlStoreType.Main, props.store.interactionStore.selectedView.fullPath).file;
                    const readOnly = (0, store_1.isReadonly)(props.store, selectedView.fullPath, m.revision) &&
                        props.store.interactionStore.selectedView.storeType !== store_1.VersionControlStoreType.Working;
                    //TODO - review this logic - not sure this is now correct
                    props.dispatch({
                        type: "selectedView",
                        selectedView: {
                            type: "diff",
                            fullPath: file.fullPath,
                            label: `base:${original.revision} v other:${m.revision}`,
                            text: m.text,
                            readOnly,
                            revision: m.revision,
                            original: original.text,
                            originalRevision: original.revision,
                            comments: m.commentStore,
                            storeType: props.store.interactionStore.selectedView.storeType,
                            originalStoreType: store_1.VersionControlStoreType.Main,
                        },
                    });
                } }, "Diff to Main")) : null,
            file.history.map((h, idx) => (React.createElement("div", { key: idx },
                React.createElement("button", { onClick: () => {
                        if (selected.indexOf(idx) > -1) {
                            setSelected(selected.filter((i) => i !== idx));
                        }
                        else {
                            setSelected(selected.concat(idx));
                        }
                    } }, selected.indexOf(idx) > -1 ? "deselect" : "select"),
                React.createElement(ViewButton, { dispatch: props.dispatch, history: h, readOnly: (0, store_1.isReadonly)(props.store, selectedView.fullPath, h.fileState.revision), storeType: selectedView.storeType }),
                React.createElement(exports.FileHistoryItem, { history: h, selectedView: selectedView })))),
            selected.length == 2 && (React.createElement(React.Fragment, null,
                React.createElement("button", { onClick: () => {
                        const m = file.history[selected[1]].fileState;
                        const original = file.history[selected[0]].fileState;
                        props.dispatch({
                            type: "selectedView",
                            selectedView: {
                                type: "diff",
                                fullPath: file.fullPath,
                                label: `base:${original.revision} v other:${m.revision}`,
                                text: m.text,
                                readOnly: (0, store_1.isReadonly)(props.store, selectedView.fullPath, m.revision),
                                revision: m.revision,
                                original: original.text,
                                originalRevision: original.revision,
                                comments: m.commentStore,
                                storeType: props.store.interactionStore.selectedView.storeType,
                                originalStoreType: props.store.interactionStore.selectedView.storeType,
                            },
                        });
                    } }, "diff"),
                React.createElement("button", { onClick: () => {
                        var _a;
                        setSelected([]);
                        const m = (_a = file.history.filter((h) => h.fileState.revision === selectedView.revision)[0]) === null || _a === void 0 ? void 0 : _a.fileState;
                        props.dispatch({
                            type: "selectedView",
                            selectedView: {
                                type: "view",
                                fullPath: file.fullPath,
                                readOnly: (0, store_1.isReadonly)(props.store, selectedView.fullPath, m.revision),
                                text: m.text,
                                revision: m.revision,
                                comments: m.commentStore,
                                storeType: props.store.interactionStore.selectedView.storeType,
                            },
                        });
                    } }, "clear")))));
    }
    return null;
};
exports.FileHistory = FileHistory;
const ViewButton = (props) => {
    return (React.createElement("button", { onClick: () => props.dispatch({
            type: "selectedView",
            selectedView: {
                type: "view",
                fullPath: props.history.fileState.fullPath,
                readOnly: props.readOnly,
                text: props.history.fileState.text,
                comments: props.history.fileState.commentStore,
                revision: props.history.fileState.revision,
                storeType: props.storeType,
            },
        }) }, "view"));
};
//# sourceMappingURL=file-history.js.map