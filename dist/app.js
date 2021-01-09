"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanelHeading = exports.PanelContent = exports.App = void 0;
const core_1 = require("@material-ui/core");
const RGL = require("react-grid-layout");
const editor_1 = require("./panels/editor");
const file_history_1 = require("./panels/file-history");
const staging_scm_1 = require("./panels/staging-scm");
const vc_history_1 = require("./panels/vc-history");
const styles_1 = require("./styles");
const React = require("react");
const use_window_size_1 = require("@rooks/use-window-size");
const ReactGridLayout = RGL.WidthProvider(RGL);
exports.App = core_1.withStyles(styles_1.AppStyles)((props) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const { innerHeight } = use_window_size_1.default();
    return (React.createElement(ReactGridLayout, { rowHeight: (innerHeight - 70) / 20, maxRows: 20, compactType: "vertical", cols: 12, margin: [5, 5], containerPadding: [5, 5], useCSSTransforms: true, draggableCancel: props.classes.panel_content, className: props.classes.layout },
        React.createElement("div", { key: "0.0", "data-grid": { x: 0, y: 0, w: 12, h: 2 }, className: props.classes.header_bar },
            React.createElement(exports.PanelHeading, null,
                "Review-Hub : ",
                props.name),
            React.createElement(exports.PanelContent, null, (_a = props.buttons) === null || _a === void 0 ? void 0 : _a.map((a, i) => (React.createElement(core_1.Button, { key: i, onClick: () => a.handleClick(props.dispatch, props.store, props.name) }, a.title))))),
        React.createElement("div", { key: "0.1", "data-grid": { x: 0, y: 1, w: 3, h: 13 }, className: props.classes.version_control },
            React.createElement(exports.PanelHeading, null,
                "version-control",
                " ",
                props.store.isHeadCommit
                    ? props.store.interactionStore.selectedCommitId
                    : "HEAD",
                props.store.isHeadCommit && (React.createElement("button", { onClick: () => props.dispatch({ type: "selectCommit", commitId: null }) }, "Switch to HEAD"))),
            React.createElement(exports.PanelContent, null,
                React.createElement(staging_scm_1.SCMPanel, { store: props.store, dispatch: props.dispatch }))),
        React.createElement("div", { key: "0.2", "data-grid": { x: 3, y: 1, w: 6, h: 13 }, className: props.classes.editor },
            React.createElement(exports.PanelHeading, null, !((_b = props.store.interactionStore.selectedView) === null || _b === void 0 ? void 0 : _b.fullPath)
                ? "Editor"
                : `Editor - ${(_c = props.store.interactionStore.selectedView) === null || _c === void 0 ? void 0 : _c.fullPath} @ ${(_d = props.store.interactionStore.selectedView) === null || _d === void 0 ? void 0 : _d.revision} ${((_e = props.store.interactionStore.selectedView) === null || _e === void 0 ? void 0 : _e.label) || ""}`),
            React.createElement(exports.PanelContent, null,
                React.createElement(editor_1.Editor, { currentUser: props.store.interactionStore.currentUser, view: props.store.interactionStore.selectedView, dispatch: props.dispatch }))),
        React.createElement("div", { key: "0.3", "data-grid": { x: 9, y: 1, w: 3, h: 13 }, className: props.classes.script_history },
            React.createElement(exports.PanelHeading, null,
                "File History ", (_f = props.store.interactionStore.selectedView) === null || _f === void 0 ? void 0 :
                _f.fullPath),
            React.createElement(exports.PanelContent, null,
                React.createElement(file_history_1.FileHistory, { file: props.store.vcStore.files[(_g = props.store.interactionStore.selectedView) === null || _g === void 0 ? void 0 : _g.fullPath], selectedView: props.store.interactionStore.selectedView, dispatch: props.dispatch }))),
        React.createElement("div", { key: "1.1", "data-grid": { x: 0, y: 2, w: 12, h: 4 }, className: props.classes.vc_history },
            React.createElement(exports.PanelHeading, null, "VC History"),
            React.createElement(exports.PanelContent, null,
                React.createElement(vc_history_1.VCHistory, { vcStore: props.store.vcStore, dispatch: props.dispatch, selectedCommitId: props.store.interactionStore.selectedCommitId, selectedView: props.store.interactionStore.selectedView }),
                React.createElement("div", null, props.store.vcStore.version)))));
});
exports.PanelContent = core_1.withStyles(styles_1.AppStyles)((props) => {
    return (React.createElement("div", { className: props.classes.panel_content, onMouseDown: (e) => e.stopPropagation(), onClick: (e) => e.stopPropagation() }, props.children));
});
exports.PanelHeading = core_1.withStyles(styles_1.AppStyles)((props) => {
    return React.createElement("div", { className: props.classes.panel_heading }, props.children);
});
//# sourceMappingURL=app.js.map