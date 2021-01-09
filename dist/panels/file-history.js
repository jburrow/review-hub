"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHistory = void 0;
const React = require("react");
const events_version_control_1 = require("../events-version-control");
const core_1 = require("@material-ui/core");
const styles_1 = require("../styles");
exports.FileHistory = core_1.withStyles(styles_1.SelectedStyles)((props) => {
    const [selected, setSelected] = React.useState([]);
    const convert = (e) => {
        var _a, _b, _c;
        const comments = ((_a = e.commentStore) === null || _a === void 0 ? void 0 : _a.comments) || {};
        return (React.createElement("span", null,
            React.createElement("span", { className: ((_b = props.selectedView) === null || _b === void 0 ? void 0 : _b.revision) === e.revision
                    ? props.classes.selectedItem
                    : props.classes.inactiveItem },
                "v",
                e.revision),
            " ",
            React.createElement("span", null, Object.values(comments).length),
            " ",
            React.createElement("div", { style: { fontSize: 10 } },
                "\"", (_c = e.text) === null || _c === void 0 ? void 0 :
                _c.substring(0, 35),
                " ...\"")));
    };
    if (props.file) {
        return (React.createElement("div", null,
            props.file.history.map((h, idx) => (React.createElement("div", { key: idx },
                React.createElement(core_1.Button, { size: "small", onClick: () => {
                        if (selected.indexOf(idx) > -1) {
                            setSelected(selected.filter((i) => i !== idx));
                        }
                        else {
                            setSelected(selected.concat(idx));
                        }
                    } }, selected.indexOf(idx) > -1 ? "deselect" : "select"),
                React.createElement(ViewButton, { dispatch: props.dispatch, history: h, readOnly: events_version_control_1.isReadonly(props.file.history, h.fileState.revision) }),
                convert(h.fileState)))),
            selected.length == 2 && (React.createElement(React.Fragment, null,
                React.createElement(core_1.Button, { size: "small", onClick: () => {
                        const m = props.file.history[selected[1]].fileState;
                        const original = props.file.history[selected[0]].fileState;
                        props.dispatch({
                            type: "selectedView",
                            fullPath: props.file.fullPath,
                            label: `base:${original.revision} v other:${m.revision}`,
                            text: m.text,
                            readOnly: events_version_control_1.isReadonly(props.file.history, m.revision),
                            revision: m.revision,
                            original: original.text,
                            originalRevision: original.revision,
                            comments: m.commentStore,
                        });
                    } }, "diff"),
                React.createElement(core_1.Button, { size: "small", onClick: () => {
                        var _a;
                        setSelected([]);
                        const m = (_a = props.file.history.filter((h) => h.fileState.revision === props.selectedView.revision)[0]) === null || _a === void 0 ? void 0 : _a.fileState;
                        props.dispatch({
                            type: "selectedView",
                            fullPath: props.file.fullPath,
                            readOnly: events_version_control_1.isReadonly(props.file.history, m.revision),
                            text: m.text,
                            revision: m.revision,
                            comments: m.commentStore,
                        });
                    } }, "clear")))));
    }
    return null;
});
const ViewButton = (props) => {
    return (React.createElement(core_1.Button, { size: "small", onClick: () => props.dispatch({
            type: "selectedView",
            fullPath: props.history.fileState.fullPath,
            readOnly: props.readOnly,
            text: props.history.fileState.text,
            comments: props.history.fileState.commentStore,
            revision: props.history.fileState.revision,
        }) }, "view"));
};
//# sourceMappingURL=file-history.js.map