"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanelHeading = exports.PanelContent = exports.App = void 0;
const core_1 = require("@material-ui/core");
const RGL = require("react-grid-layout");
const events_version_control_1 = require("./events-version-control");
const editor_1 = require("./panels/editor");
const file_history_1 = require("./panels/file-history");
const staging_scm_1 = require("./panels/staging-scm");
const vc_history_1 = require("./panels/vc-history");
const store_1 = require("./store");
const styles_1 = require("./styles");
const React = require("react");
const use_window_size_1 = require("@rooks/use-window-size");
const ReactGridLayout = RGL.WidthProvider(RGL);
class LocalStoragePersistence {
    async save(store) {
        return new Promise((resolve) => resolve(true));
    }
    async load() {
        return new Promise((resolve) => resolve(events_version_control_1.initialVersionControlState()));
    }
}
exports.App = core_1.withStyles(styles_1.AppStyles)((props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const persistence = (_a = props.persistence) !== null && _a !== void 0 ? _a : new LocalStoragePersistence();
    const [store, dispatch] = React.useReducer(store_1.appReducer, store_1.initialState);
    const { innerHeight } = use_window_size_1.default();
    React.useEffect(() => {
        const effect = async () => {
            if (props.options.loadOnStartup) {
                dispatch({ type: "load", vcStore: await persistence.load() });
            }
        };
        effect();
    }, [(_b = props.options) === null || _b === void 0 ? void 0 : _b.loadOnStartup]);
    React.useEffect(() => {
        if (props.currentUser) {
            dispatch({ type: "setCurrentUser", user: props.currentUser });
        }
    }, [props.currentUser]);
    return (React.createElement(ReactGridLayout, { rowHeight: (innerHeight - 70) / 20, maxRows: 20, compactType: "vertical", cols: 12, margin: [5, 5], containerPadding: [5, 5], useCSSTransforms: true, draggableCancel: props.classes.panel_content, className: props.classes.layout },
        React.createElement("div", { key: "0.0", "data-grid": { x: 0, y: 0, w: 12, h: 2 }, className: props.classes.header_bar },
            React.createElement(exports.PanelHeading, null,
                "Review-Hub : ",
                props.name),
            React.createElement(exports.PanelContent, null, (_c = props.buttons) === null || _c === void 0 ? void 0 : _c.map((a, i) => (React.createElement(core_1.Button, { key: i, onClick: () => a.handleClick(dispatch, store, persistence, props.currentUser, props.name) }, a.title))))),
        React.createElement("div", { key: "0.1", "data-grid": { x: 0, y: 1, w: 3, h: 13 }, className: props.classes.version_control },
            React.createElement(exports.PanelHeading, null,
                "version-control",
                " ",
                store.isHeadCommit
                    ? store.interactionStore.selectedCommitId
                    : "HEAD",
                store.isHeadCommit && (React.createElement("button", { onClick: () => dispatch({ type: "selectCommit", commitId: null }) }, "Switch to HEAD"))),
            React.createElement(exports.PanelContent, null,
                React.createElement(staging_scm_1.SCMPanel, { store: store, dispatch: dispatch }))),
        React.createElement("div", { key: "0.2", "data-grid": { x: 3, y: 1, w: 6, h: 13 }, className: props.classes.editor },
            React.createElement(exports.PanelHeading, null, !((_d = store.interactionStore.selectedView) === null || _d === void 0 ? void 0 : _d.fullPath)
                ? "Editor"
                : `Editor - ${(_e = store.interactionStore.selectedView) === null || _e === void 0 ? void 0 : _e.fullPath} @ ${(_f = store.interactionStore.selectedView) === null || _f === void 0 ? void 0 : _f.revision} ${((_g = store.interactionStore.selectedView) === null || _g === void 0 ? void 0 : _g.label) || ""}`),
            React.createElement(exports.PanelContent, null,
                React.createElement(editor_1.Editor, { currentUser: store.interactionStore.currentUser, view: store.interactionStore.selectedView, dispatch: dispatch }))),
        React.createElement("div", { key: "0.3", "data-grid": { x: 9, y: 1, w: 3, h: 13 }, className: props.classes.script_history },
            React.createElement(exports.PanelHeading, null,
                "File History ", (_h = store.interactionStore.selectedView) === null || _h === void 0 ? void 0 :
                _h.fullPath),
            React.createElement(exports.PanelContent, null,
                React.createElement(file_history_1.FileHistory, { file: store.vcStore.files[(_j = store.interactionStore.selectedView) === null || _j === void 0 ? void 0 : _j.fullPath], selectedView: store.interactionStore.selectedView, dispatch: dispatch }))),
        React.createElement("div", { key: "1.1", "data-grid": { x: 0, y: 2, w: 12, h: 4 }, className: props.classes.vc_history },
            React.createElement(exports.PanelHeading, null, "VC History"),
            React.createElement(exports.PanelContent, null,
                React.createElement(vc_history_1.VCHistory, { vcStore: store.vcStore, dispatch: dispatch, selectedCommitId: store.interactionStore.selectedCommitId, selectedView: store.interactionStore.selectedView }),
                React.createElement("div", null, store.vcStore.version)))));
});
exports.PanelContent = core_1.withStyles(styles_1.AppStyles)((props) => {
    return (React.createElement("div", { className: props.classes.panel_content, onMouseDown: (e) => e.stopPropagation(), onClick: (e) => e.stopPropagation() }, props.children));
});
exports.PanelHeading = core_1.withStyles(styles_1.AppStyles)((props) => {
    return React.createElement("div", { className: props.classes.panel_heading }, props.children);
});
//# sourceMappingURL=app.js.map