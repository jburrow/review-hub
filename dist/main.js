"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const react_1 = require("@monaco-editor/react");
const React = require("react");
const react_dom_1 = require("react-dom");
require("react-grid-layout/css/styles.css");
require("react-resizable/css/styles.css");
const app_1 = require("./app");
Object.defineProperty(exports, "App", { enumerable: true, get: function () { return app_1.App; } });
const demo_store_1 = require("./demo-store");
// import "./index.css";
react_1.monaco.init().then(() => console.debug("Monaco has initialized..."));
react_dom_1.render(React.createElement(app_1.App, { persistence: demo_store_1.demoStore, currentUser: "current-user", options: { loadOnStartup: true, showToolbar: true } }), document.getElementById("root"));
//# sourceMappingURL=main.js.map