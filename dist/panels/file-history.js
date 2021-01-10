"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHistory = void 0;
const React = require("react");
const store_1 = require("../store");
const events_version_control_1 = require("../events-version-control");
const core_1 = require("@material-ui/core");
const styles_1 = require("../styles");
exports.FileHistory = core_1.withStyles(styles_1.SelectedStyles)((props) => {
    var _a;
    const [selected, setSelected] = React.useState([]);
    const file = props.store.vcStore.files[(_a = props.store.interactionStore.selectedView) === null || _a === void 0 ? void 0 : _a.fullPath];
    const selectedView = props.store.interactionStore.selectedView;
    const convert = (e) => {
        var _a, _b;
        const comments = ((_a = e.commentStore) === null || _a === void 0 ? void 0 : _a.comments) || {};
        return (React.createElement("span", null,
            React.createElement("span", { className: (selectedView === null || selectedView === void 0 ? void 0 : selectedView.revision) === e.revision ? props.classes.selectedItem : props.classes.inactiveItem },
                "v",
                e.revision),
            " ",
            React.createElement("span", null, Object.values(comments).length),
            " ",
            React.createElement("div", { style: { fontSize: 10 } },
                "\"", (_b = e.text) === null || _b === void 0 ? void 0 :
                _b.substring(0, 35),
                " ...\"")));
    };
    if (file) {
        return (React.createElement("div", null,
            props.store.mainStore && props.store.interactionStore.selectedView ? (React.createElement(core_1.Button, { size: "small", onClick: () => {
                    const m = store_1.getFile(props.store, props.store.interactionStore.selectedView.storeType, props.store.interactionStore.selectedView.fullPath);
                    const original = store_1.getFile(props.store, store_1.VersionControlStoreType.Main, props.store.interactionStore.selectedView.fullPath);
                    props.dispatch({
                        type: "selectedView",
                        selectedView: {
                            type: "diff",
                            fullPath: file.fullPath,
                            label: `base:${original.revision} v other:${m.revision}`,
                            text: m.text,
                            readOnly: events_version_control_1.isReadonly(file.history, m.revision),
                            revision: m.revision,
                            original: original.text,
                            originalRevision: original.revision,
                            comments: m.commentStore,
                            storeType: props.store.interactionStore.selectedView.storeType,
                            originalStoreType: props.store.interactionStore.selectedView.storeType,
                        },
                    });
                } }, "Diff to Main")) : null,
            file.history.map((h, idx) => (React.createElement("div", { key: idx },
                React.createElement(core_1.Button, { size: "small", onClick: () => {
                        if (selected.indexOf(idx) > -1) {
                            setSelected(selected.filter((i) => i !== idx));
                        }
                        else {
                            setSelected(selected.concat(idx));
                        }
                    } }, selected.indexOf(idx) > -1 ? "deselect" : "select"),
                React.createElement(ViewButton, { dispatch: props.dispatch, history: h, readOnly: events_version_control_1.isReadonly(file.history, h.fileState.revision) }),
                convert(h.fileState)))),
            selected.length == 2 && (React.createElement(React.Fragment, null,
                React.createElement(core_1.Button, { size: "small", onClick: () => {
                        const m = file.history[selected[1]].fileState;
                        const original = file.history[selected[0]].fileState;
                        props.dispatch({
                            type: "selectedView",
                            selectedView: {
                                type: "diff",
                                fullPath: file.fullPath,
                                label: `base:${original.revision} v other:${m.revision}`,
                                text: m.text,
                                readOnly: events_version_control_1.isReadonly(file.history, m.revision),
                                revision: m.revision,
                                original: original.text,
                                originalRevision: original.revision,
                                comments: m.commentStore,
                                storeType: store_1.VersionControlStoreType.Branch,
                                originalStoreType: store_1.VersionControlStoreType.Branch,
                            },
                        });
                    } }, "diff"),
                React.createElement(core_1.Button, { size: "small", onClick: () => {
                        var _a;
                        setSelected([]);
                        const m = (_a = file.history.filter((h) => h.fileState.revision === selectedView.revision)[0]) === null || _a === void 0 ? void 0 : _a.fileState;
                        props.dispatch({
                            type: "selectedView",
                            selectedView: {
                                type: "view",
                                fullPath: file.fullPath,
                                readOnly: events_version_control_1.isReadonly(file.history, m.revision),
                                text: m.text,
                                revision: m.revision,
                                comments: m.commentStore,
                                storeType: store_1.VersionControlStoreType.Branch,
                            },
                        });
                    } }, "clear")))));
    }
    return null;
});
const ViewButton = (props) => {
    return (React.createElement(core_1.Button, { size: "small", onClick: () => props.dispatch({
            type: "selectedView",
            selectedView: {
                type: "view",
                fullPath: props.history.fileState.fullPath,
                readOnly: props.readOnly,
                text: props.history.fileState.text,
                comments: props.history.fileState.commentStore,
                revision: props.history.fileState.revision,
                storeType: store_1.VersionControlStoreType.Branch,
            },
        }) }, "view"));
};
//# sourceMappingURL=file-history.js.map