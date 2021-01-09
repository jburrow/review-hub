import { monaco } from "@monaco-editor/react";
import * as React from "react";
import { render } from "react-dom";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { App } from "./app";
import { demoStore } from "./demo-store";
import { generateZip } from "./import-export";
import "./index.css";
import { appReducer, initialState } from "./store";

monaco.init().then(() => console.debug("Monaco has initialized..."));
const currentUser = "current-user";

const DemoApp = () => {
  const [store, dispatch] = React.useReducer(appReducer, {
    ...initialState,
    interactionStore: { currentUser },
  });

  React.useEffect(() => {
    const effect = async () => {
      dispatch({ type: "load", vcStore: await demoStore.load() });
    };

    effect();
  }, []);

  return (
    <App
      store={store}
      dispatch={dispatch}
      name="Demo Review Set"
      buttons={[
        {
          title: "Download Zip",
          handleClick: (dispatch, store) => {
            generateZip({
              ...store.vcStore.files,
              ...store.wsStore.files,
            });
          },
        },
        {
          title: "Load",
          handleClick: async (dispatch) => {
            dispatch({ type: "load", vcStore: await demoStore.load() });
          },
        },
        {
          title: "Save",
          handleClick: (dispatch, store) => {
            demoStore.save(store.vcStore);
          },
        },
      ]}
    />
  );
};

render(<DemoApp />, document.getElementById("root"));
