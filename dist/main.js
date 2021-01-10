"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@monaco-editor/react");
const React = require("react");
const react_dom_1 = require("react-dom");
require("react-grid-layout/css/styles.css");
require("react-resizable/css/styles.css");
const _1 = require(".");
const app_1 = require("./app");
const demo_store_1 = require("./demo-store");
const import_export_1 = require("./import-export");
require("./index.css");
const store_1 = require("./store");
react_1.monaco.init().then(() => console.debug("Monaco has initialized..."));
const currentUser = "current-user";
const DemoApp = () => {
    const [store, dispatch] = React.useReducer(store_1.appReducer, {
        ...store_1.initialState,
        interactionStore: { currentUser },
    });
    React.useEffect(() => {
        const effect = async () => {
            dispatch({ type: "load", vcStore: await demo_store_1.demoStore.load() });
        };
        effect();
    }, []);
    return (React.createElement(app_1.App, { store: store, dispatch: dispatch, name: "Demo Review Set", buttons: [
            {
                title: "Download Zip",
                handleClick: (dispatch, store) => {
                    import_export_1.generateZip({
                        ...store.vcStore.files,
                        ...store.wsStore.files,
                    });
                },
            },
            {
                title: "Pull Main",
                handleClick: (dispatch, store) => {
                    const mainStore = _1.initialVersionControlState();
                    dispatch({ type: "load", mainStore });
                },
            },
            {
                title: "Load",
                handleClick: async (dispatch) => {
                    dispatch({ type: "load", vcStore: await demo_store_1.demoStore.load() });
                },
            },
            {
                title: "Save",
                handleClick: (dispatch, store) => {
                    demo_store_1.demoStore.save(store.vcStore);
                },
            },
        ] }));
};
react_dom_1.render(React.createElement(DemoApp, null), document.getElementById("root"));
//# sourceMappingURL=main.js.map