import { monaco } from "@monaco-editor/react";
import * as React from "react";
import { render } from "react-dom";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { App } from "./app";
import { demoStore } from "./demo-store";
import { generateZip } from "./import-export";
import "./index.css";

monaco.init().then(() => console.debug("Monaco has initialized..."));

render(
  <App
    persistence={demoStore}
    currentUser="current-user"
    options={{ loadOnStartup: true }}
    buttons={[
      {
        title: "Download Zip",
        handleClick: (dispatch, store, persistence, currentUser, name) => {
          generateZip({
            ...store.vcStore.files,
            ...store.wsStore.files,
          });
        },
      },
      {
        title: "Load",
        handleClick: async (
          dispatch,
          store,
          persistence,
          currentUser,
          name
        ) => {
          dispatch({ type: "load", vcStore: await persistence.load() });
        },
      },
      {
        title: "Save",
        handleClick: (dispatch, store, persistence, currentUser, name) => {
          persistence.save(store.vcStore);
        },
      },
    ]}
  />,
  document.getElementById("root")
);
