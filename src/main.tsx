import { monaco } from "@monaco-editor/react";
import * as React from "react";
import { render } from "react-dom";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { App } from "./app";
import { demoStore } from "./demo-store";
import "./index.css";
import { Toolbar } from "./panels/toolbar";

monaco.init().then(() => console.debug("Monaco has initialized..."));

render(
  <App
    persistence={demoStore}
    currentUser="current-user"
    options={{ loadOnStartup: true, showToolbar: true }}
    panels={(dispatch, store, persistence) => {
      return [
        <Toolbar dispatch={dispatch} store={store} persistence={persistence} />,
      ];
    }}
  />,
  document.getElementById("root")
);
