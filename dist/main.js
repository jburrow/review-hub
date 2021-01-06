"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@monaco-editor/react");
const React = require("react");
const react_dom_1 = require("react-dom");
require("react-grid-layout/css/styles.css");
require("react-resizable/css/styles.css");
const app_1 = require("./app");
const demo_store_1 = require("./demo-store");
const import_export_1 = require("./import-export");
require("./index.css");
react_1.monaco.init().then(() => console.debug("Monaco has initialized..."));
react_dom_1.render(React.createElement(app_1.App, { persistence: demo_store_1.demoStore, currentUser: "current-user", options: { loadOnStartup: true }, buttons: [
        {
            title: "Download Zip",
            handleClick: (dispatch, store, persistence, currentUser, name) => {
                import_export_1.generateZip({
                    ...store.vcStore.files,
                    ...store.wsStore.files,
                });
            },
        },
        {
            title: "Load",
            handleClick: async (dispatch, store, persistence, currentUser, name) => {
                dispatch({ type: "load", vcStore: await persistence.load() });
            },
        },
        {
            title: "Save",
            handleClick: (dispatch, store, persistence, currentUser, name) => {
                persistence.save(store.vcStore);
            },
        },
    ] }), document.getElementById("root"));
//# sourceMappingURL=main.js.map