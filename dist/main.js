"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_dom_1 = require("react-dom");
const React = require("react");
const RGL = require("react-grid-layout");
const events_version_control_1 = require("./events-version-control");
const react_1 = require("@monaco-editor/react");
require("react-resizable/css/styles.css");
require("react-grid-layout/css/styles.css");
const dist_1 = require("monaco-review/dist");
require("./index.css");
const ReactGridLayout = RGL.WidthProvider(RGL);
react_1.monaco.init().then(() => console.debug('Monaco has initialized...', window.monaco));
const Editor = (props) => {
    const [text, setText] = React.useState(null);
    const [comments, setComments] = React.useState(null);
    const [reviewManager, setReviewManager] = React.useState(null);
    React.useEffect(() => {
        if (props.view) {
            setText(props.view.text);
            setComments([]);
        }
    }, [props.view]);
    React.useEffect(() => {
        var _a, _b;
        console.debug('load comments', (_b = (_a = props.view) === null || _a === void 0 ? void 0 : _a.comments) === null || _b === void 0 ? void 0 : _b.comments);
        if (reviewManager !== null && props.view) {
            //mx.editor.createModel()
            const model = (window.monaco).editor.createModel(props.view.text, 'javascript');
            reviewManager.editor.setModel(model);
            reviewManager.loadFromStore(props.view.comments, []);
        }
    }, [reviewManager, props.view]);
    function setEditor(editor) {
        const rm = dist_1.createReviewManager(editor, props.currentUser, [], (c) => { console.log('CONSOLE', c); setComments(c); });
        setReviewManager(rm);
    }
    return props.view && props.view.fullPath ? React.createElement("div", null,
        text !== props.view.text ? React.createElement("button", { onClick: () => {
                props.wsDispatch({
                    type: 'commit',
                    author: props.currentUser,
                    events: [{ type: 'edit', fullPath: props.view.fullPath, text: text }]
                });
            } }, "Save") : React.createElement("div", null, "not modified text"),
        (comments || []).length ? React.createElement("button", { onClick: () => {
                props.wsDispatch({
                    type: 'commit',
                    author: props.currentUser,
                    events: [{ type: 'comment', fullPath: props.view.fullPath, commentEvents: comments }]
                });
            } },
            "Save Comments ",
            `${comments.length}`) : React.createElement("div", null, "not modified comments"),
        props.view.original ?
            React.createElement(react_1.DiffEditor, { editorDidMount: (_modified, _original, editor) => {
                    editor.getModifiedEditor().onDidChangeModelContent(() => setText(editor.getModifiedEditor().getValue()));
                    setEditor(editor.getModifiedEditor());
                }, options: { originalEditable: false }, height: 200, modified: props.view.text, original: props.view.original }) :
            React.createElement(react_1.ControlledEditor, { value: props.view.text, height: 200, options: { readOnly: false }, editorDidMount: (_, editor) => {
                    setEditor(editor);
                }, onChange: (e, t) => setText(t) })) : null;
};
const History = (props) => {
    const [selected, setSelected] = React.useState([]);
    const convert = (e) => {
        switch (e.event.type) {
            case "edit":
                return `${e.revision} : ${e.event.fullPath} : "${e.event.text.substring(0, 10)} ..."`;
            default:
                return JSON.stringify(e);
        }
    };
    if (props.script) {
        const events = [];
        for (const history of props.script.history) {
            if (history.type === 'commit') {
                for (const e of history.events) {
                    if (props.script.fullPath === e.fullPath) {
                        events.push({ revision: history.id, event: e });
                    }
                }
            }
        }
        return React.createElement("div", null,
            events.map((h, idx) => (React.createElement("div", { key: idx },
                React.createElement("button", { onClick: () => {
                        if (selected.indexOf(idx) > -1) {
                            setSelected(selected.filter((i) => i !== idx));
                        }
                        else {
                            setSelected(selected.concat(idx));
                        }
                    } }, selected.indexOf(idx) > -1 ? 'deselect' : 'select'),
                React.createElement("button", { onClick: () => props.appDispatch({
                        type: "selectedView",
                        fullPath: h.event.fullPath,
                        text: h.event.text,
                    }) }, "view"),
                convert(h)))),
            selected.length == 2 && React.createElement("button", { onClick: () => {
                    const m = events[selected[1]];
                    const original = events[selected[0]];
                    props.appDispatch({
                        type: "selectedView",
                        fullPath: props.script.fullPath,
                        label: `base:${original.revision} v other:${m.revision}`,
                        text: m.event.text,
                        original: original.event.text
                    });
                } }, "diff"));
    }
    return null;
};
const reducer = (state, event) => {
    switch (event.type) {
        case "selectScript":
            return Object.assign(Object.assign({}, state), { selectedScript: { fullPath: event.fullPath } });
        case "selectedView":
            return Object.assign(Object.assign({}, state), { selectedView: {
                    fullPath: event.fullPath,
                    text: event.text,
                    original: event.original,
                    label: event.label,
                    comments: event.comments
                } });
    }
    return state;
};
function loadVersionControlStore() {
    const events = [
        { fullPath: "/script1.py", text: "function version(){ return 's1.1'}", type: "edit" },
        { fullPath: "/script2.py", text: "function version(){ return 's2.1'}", type: "edit" },
        { fullPath: "/script3.py", text: "function version(){ return 's3.1'}", type: "edit" }
    ];
    const store = events_version_control_1.reduceVersionControl([{
            type: "commit", author: "james", id: 'id-0',
            events: events
        }, {
            type: "commit", author: "james", id: 'id-1',
            events: [{ fullPath: "/script1.py", text: "function version(){ return 's1.2'}", type: "edit" }]
        }, {
            type: "commit", author: "james", id: 'id-2',
            events: [{ fullPath: "/script1.py", text: "function version(){ return 's1.3'}", type: "edit" }]
        }]);
    return store;
}
exports.App = () => {
    const [appState, appDispatch] = React.useReducer(reducer, {});
    const [vcStore, vcDispatch] = React.useReducer(events_version_control_1.versionControlReducer, loadVersionControlStore());
    const [wsStore, wsDispatch] = React.useReducer(events_version_control_1.versionControlReducer, events_version_control_1.initialVersionControlState());
    const [cmtStore, cmtDispatch] = React.useReducer(() => null, {});
    const currentUser = 'xyz-user';
    return (React.createElement(ReactGridLayout, { rowHeight: 30, maxRows: 20, compactType: null, cols: 12, useCSSTransforms: false, draggableCancel: ".fish" },
        React.createElement("div", { key: "0.1", "data-grid": { x: 0, y: 0, w: 3, h: 8 }, style: { backgroundColor: 'pink', } },
            React.createElement("div", { className: "fish" },
                React.createElement("h3", null, "version-control"),
                React.createElement(SCM, { appDispatch: appDispatch, files: vcStore.files }),
                vcStore.events.length,
                React.createElement("h3", null, "working set"),
                React.createElement(SCM, { appDispatch: appDispatch, files: wsStore.files }),
                wsStore.events.length,
                React.createElement("button", { onClick: () => {
                        let events = [];
                        for (const e of wsStore.events) {
                            if (e.type == 'commit') {
                                events = events.concat(e.events);
                            }
                        }
                        vcDispatch({
                            type: "commit", author: "james", id: 'id-2',
                            events: events
                        });
                        wsDispatch({ type: "reset" });
                    } }, "Commit"))),
        React.createElement("div", { key: "0.2", "data-grid": { x: 3, y: 0, w: 6, h: 8, }, style: { backgroundColor: 'yellow', } },
            appState.selectedView ? React.createElement("h5", null,
                "Editor - ",
                appState.selectedView.fullPath,
                " - ",
                appState.selectedView.label) : 'Editor',
            React.createElement("div", { className: "fish", style: { height: "calc(100% - 100px)", backgroundColor: 'red' } },
                React.createElement(Editor, { currentUser: currentUser, view: appState.selectedView, wsDispatch: wsDispatch }))),
        React.createElement("div", { key: "0.3", "data-grid": { x: 9, y: 0, w: 3, h: 8 }, style: { backgroundColor: 'orange', } },
            React.createElement("h3", null, "History"),
            React.createElement("div", { className: "fish" },
                React.createElement(History, { script: appState.selectedScript && vcStore.files[appState.selectedScript.fullPath], appDispatch: appDispatch }))),
        React.createElement("div", { key: "1.1", "data-grid": { x: 0, y: 1, w: 12, h: 10 }, style: { backgroundColor: 'cyan', } },
            React.createElement("h3", null, "VC History"),
            React.createElement("div", { className: "fish" },
                React.createElement(VCHistory, { vcStore: vcStore })),
            vcStore.version)));
};
const VCHistory = (props) => {
    const rows = [];
    for (const e of props.vcStore.events) {
        if (e.type == 'commit') {
            rows.push(`commit: ${e.id}`);
            for (const fe of e.events) {
                rows.push(JSON.stringify(fe));
            }
        }
    }
    return React.createElement("div", null, rows.reverse().map((r, idx) => React.createElement("div", { key: idx }, r)));
};
const SCM = (props) => {
    const handleClick = (fullPath) => {
        const value = props.files[fullPath];
        props.appDispatch({ type: 'selectScript', fullPath: value.fullPath });
        props.appDispatch({ type: 'selectedView', fullPath: value.fullPath, text: value.text, comments: value.comments });
    };
    const items = Object.entries(props.files).map(([key, value]) => React.createElement(SCMItem, { key: value.fullPath, fullPath: value.fullPath, onClick: handleClick }));
    return React.createElement("ul", null, items);
};
const SCMItem = (props) => {
    return React.createElement("li", { onClick: () => props.onClick(props.fullPath) }, props.fullPath);
};
react_dom_1.render(React.createElement(exports.App, null), document.getElementById('root'));
//# sourceMappingURL=main.js.map