"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanelHeading = exports.PanelContent = exports.App = void 0;
const RGL = require("react-grid-layout");
const editor_1 = require("./panels/editor");
const file_history_1 = require("./panels/file-history");
const staging_scm_1 = require("./panels/staging-scm");
const timeline_1 = require("./panels/timeline");
const styles_1 = require("./styles");
const React = require("react");
const rooks_1 = require("rooks");
const ReactGridLayout = RGL.WidthProvider(RGL);
const App = (props) => {
    var _a, _b, _c, _d, _e, _f;
    const { innerHeight } = (0, rooks_1.useWindowSize)();
    return (React.createElement(ReactGridLayout, { rowHeight: (innerHeight - 70) / 20, maxRows: 20, compactType: "vertical", cols: 12, margin: [5, 5], containerPadding: [5, 5], useCSSTransforms: true, draggableCancel: "panel_content", style: styles_1.AppStyles.layout },
        React.createElement("div", { key: "0.0", "data-grid": { x: 0, y: 0, w: 12, h: 2 }, style: styles_1.AppStyles.header_bar },
            React.createElement(exports.PanelHeading, null,
                "Review-Hub : ",
                props.name),
            React.createElement(exports.PanelContent, null, (_a = props.buttons) === null || _a === void 0 ? void 0 : _a.map((a, i) => (React.createElement("button", { key: i, onClick: () => a.handleClick(props.dispatch, props.store, props.name) }, a.title))))),
        React.createElement("div", { key: "0.1", "data-grid": { x: 0, y: 1, w: 3, h: 13 }, style: styles_1.AppStyles.version_control },
            React.createElement(exports.PanelHeading, null,
                "version-control ",
                props.store.isHeadCommit ? props.store.interactionStore.selectedCommitId : "HEAD",
                props.store.isHeadCommit && (React.createElement("button", { onClick: () => props.dispatch({ type: "selectCommit", commitId: null }) }, "Switch to HEAD"))),
            React.createElement(exports.PanelContent, null,
                React.createElement(staging_scm_1.SCMPanel, { store: props.store, dispatch: props.dispatch }))),
        React.createElement("div", { key: "0.2", "data-grid": { x: 3, y: 1, w: 6, h: 13 }, style: styles_1.AppStyles.editor },
            React.createElement(exports.PanelHeading, null, !((_b = props.store.interactionStore.selectedView) === null || _b === void 0 ? void 0 : _b.fullPath)
                ? "Editor"
                : `Editor - ${(_c = props.store.interactionStore.selectedView) === null || _c === void 0 ? void 0 : _c.fullPath} @ ${(_d = props.store.interactionStore.selectedView) === null || _d === void 0 ? void 0 : _d.revision} ${((_e = props.store.interactionStore.selectedView) === null || _e === void 0 ? void 0 : _e.label) || ""}`),
            React.createElement(exports.PanelContent, null,
                React.createElement(editor_1.Editor, { currentUser: props.store.interactionStore.currentUser, view: props.store.interactionStore.selectedView, dispatch: props.dispatch }))),
        React.createElement("div", { key: "0.3", "data-grid": { x: 9, y: 1, w: 3, h: 13 }, style: styles_1.AppStyles.script_history },
            React.createElement(exports.PanelHeading, null,
                "File History ", (_f = props.store.interactionStore.selectedView) === null || _f === void 0 ? void 0 :
                _f.fullPath),
            React.createElement(exports.PanelContent, null,
                React.createElement(file_history_1.FileHistory, { store: props.store, dispatch: props.dispatch }))),
        React.createElement("div", { key: "1.1", "data-grid": { x: 0, y: 2, w: 12, h: 4 }, style: styles_1.AppStyles.vc_history },
            React.createElement(exports.PanelHeading, null, "Timeline"),
            React.createElement(exports.PanelContent, null,
                React.createElement(timeline_1.Timeline, { store: props.store, dispatch: props.dispatch, selectedCommitId: props.store.interactionStore.selectedCommitId, selectedView: props.store.interactionStore.selectedView }),
                React.createElement("div", null, props.store.vcStore.version)))));
};
exports.App = App;
const PanelContent = (props) => {
    return (React.createElement("div", { style: styles_1.AppStyles.panel_content, onMouseDown: (e) => e.stopPropagation(), onClick: (e) => e.stopPropagation() }, props.children));
};
exports.PanelContent = PanelContent;
const PanelHeading = (props) => {
    return React.createElement("div", { style: styles_1.AppStyles.panel_heading }, props.children);
};
exports.PanelHeading = PanelHeading;
//# sourceMappingURL=app.js.map