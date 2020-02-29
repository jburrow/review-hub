import { monaco } from "@monaco-editor/react";
import * as React from "react";
import { render } from "react-dom";
import * as RGL from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import {
  FileEvents,
  initialVersionControlState,
  reduceVersionControl,
  VersionControlState,
  FileStateStatus
} from "./events-version-control";
import "./index.css";
import { Editor } from "./panels/editor";
import { FileHistory } from "./panels/file-history";
import { VCHistory } from "./panels/vc-history";
import { StagingSCM, SCM } from "./panels/staging-scm";
import { XReducer } from "./store";
import { withStyles, WithStyles } from "@material-ui/core";
import { AppStyles } from "./styles";

const ReactGridLayout = RGL.WidthProvider(RGL);

monaco
  .init()
  .then(() =>
    console.debug("Monaco has initialized...", (window as any).monaco)
  );

function loadVersionControlStore(): VersionControlState {
  const events: FileEvents[] = [
    {
      fullPath: "/script1.py",
      text: "function version(){ return 's1.1'}",
      type: "edit"
    },

    {
      fullPath: "/script3.py",
      text: "function version(){ return 's3.1'}",
      type: "edit"
    }
  ];

  const store = reduceVersionControl([
    {
      type: "commit",
      author: "james",
      id: "id-0",
      events: events
    },
    {
      type: "commit",
      author: "james",
      id: "id-1",
      events: [
        {
          fullPath: "/script1.py",
          text: "function version(){ return 's1.2'}",
          type: "edit"
        },
        {
          fullPath: "/script2.py",
          text: "function version(){ return 's2.1'}",
          type: "edit"
        }
      ]
    },
    {
      type: "commit",
      author: "james",
      id: "id-2",
      events: [
        {
          fullPath: "/script1.py",
          text: "function version(){ return 's1.3'}",
          type: "edit"
        }
      ]
    },
    {
      type: "commit",
      author: "james",
      id: "id-4",
      events: [
        {
          fullPath: "/script1.py",
          commentEvents: [
            {
              lineNumber: 1,
              text: "",
              type: "create",
              createdAt: "",
              createdBy: "xxx",
              id: "1"
            }
          ],
          type: "comment"
        }
      ]
    }
  ]);

  return store;
}

// interface DataGridItemProps {
//   key: string;
//   dataGrid: any;
//   className: string;
//   style?: any;
// }

// const DataGridItem = withStyles(AppStyles)(
//   (props: DataGridItemProps & WithStyles<typeof AppStyles>) => {
//     return (
//       <div
//         key={props.key}
//         data-grid={props.dataGrid}
//         className={props.className}
//         style={props.style}
//       >
//         {JSON.stringify(props.dataGrid)}
//         <div className={props.classes.panel_content}>
//           {(props as any).children}
//         </div>
//       </div>
//     );
//   }
// );

export const App = withStyles(AppStyles)(
  (props: WithStyles<typeof AppStyles>) => {
    const [store, dispatch] = React.useReducer(XReducer, {
      appStore: {},
      wsStore: initialVersionControlState(),
      vcStore: loadVersionControlStore()
    });

    const activeFiles = store.appStore.selectedCommitId
      ? store.vcStore.commits[store.appStore.selectedCommitId]
      : store.vcStore.files;

    console.log("appStore.selectedCommitId", store.appStore.selectedCommitId);
    const currentUser = "xyz-user";

    return (
      <ReactGridLayout
        rowHeight={30}
        maxRows={20}
        compactType={"vertical"}
        cols={12}
        useCSSTransforms={false}
        draggableCancel={props.classes.panel_content}
        className={props.classes.layout}
      >
        <div
          key="0.1"
          data-grid={{ x: 0, y: 0, w: 3, h: 8 }}
          className={props.classes.version_control}
        >
          <h3>
            version-control{" "}
            {store.appStore.selectedCommitId
              ? store.appStore.selectedCommitId
              : "HEAD"}
            {store.appStore.selectedCommitId && (
              <button
                onClick={() =>
                  dispatch({ type: "selectCommit", commitId: null })
                }
              >
                HEAD
              </button>
            )}
          </h3>

          <SCM
            dispatch={dispatch}
            files={activeFiles}
            selectedFile={store.appStore.selectedFile}
            filter={i => {
              debugger;
              return i[1].status === FileStateStatus.active;
            }}
          />
          {store.vcStore.events.length}

          <StagingSCM
            dispatch={dispatch}
            events={store.wsStore.events}
            wsfiles={store.wsStore.files}
            vcfiles={store.vcStore.files}
            selectedFile={store.appStore.selectedFile}
          ></StagingSCM>
        </div>
        {/* <DataGridItem
          dataGrid={{ x: 3, y: 0, w: 6, h: 8 }}
          key={"unique"}
          className={props.classes.vc_history}
        >
          HELLO
        </DataGridItem> */}
        <div
          key="0.2"
          data-grid={{ x: 3, y: 0, w: 6, h: 8 }}
          className={props.classes.editor}
        >
          <div>
            Editor - {store.appStore.selectedView?.fullPath} -{" "}
            {store.appStore.selectedView?.label}
          </div>

          <div className={props.classes.panel_content}>
            <Editor
              currentUser={currentUser}
              view={store.appStore.selectedView}
              dispatch={dispatch}
            />
          </div>
        </div>
        <div
          key="0.3"
          data-grid={{ x: 9, y: 0, w: 3, h: 8 }}
          className={props.classes.script_history}
        >
          <h3>File History {store.appStore.selectedFile}</h3>
          <div className={props.classes.panel_content}>
            <FileHistory
              file={
                store.appStore.selectedFile &&
                store.vcStore.files[store.appStore.selectedFile]
              }
              selectedView={store.appStore.selectedView}
              dispatch={dispatch}
            />
          </div>
        </div>
        <div
          key="1.1"
          data-grid={{ x: 0, y: 1, w: 12, h: 10 }}
          className={props.classes.vc_history}
        >
          <h3>VC History</h3>
          <div className={props.classes.panel_content}>
            <VCHistory
              vcStore={store.vcStore}
              dispatch={dispatch}
              selectedCommitId={store.appStore.selectedCommitId}
              selectedView={store.appStore.selectedView}
            />
            <div>{store.vcStore.version}</div>
          </div>
        </div>
      </ReactGridLayout>
    );
  }
);

render(<App />, document.getElementById("root"));

// .color-primary-0 { color: #D28C1F }	/* Main Primary color */
// .color-primary-1 { color: #FFC56C }
// .color-primary-2 { color: #E4B367 }
// .color-primary-3 { color: #684D25 }
// .color-primary-4 { color: #6E4300 }

// .color-secondary-1-0 { color: #D2C71F }	/* Main Secondary color (1) */
// .color-secondary-1-1 { color: #FFF66C }
// .color-secondary-1-2 { color: #E4DC67 }
// .color-secondary-1-3 { color: #686325 }
// .color-secondary-1-4 { color: #6E6800 }

// .color-secondary-2-0 { color: #561E8E }	/* Main Secondary color (2) */
// .color-secondary-2-1 { color: #8D5AC1 }
// .color-secondary-2-2 { color: #734C9A }
// .color-secondary-2-3 { color: #311C46 }
// .color-secondary-2-4 { color: #27044B }

// .color-complement-0 { color: #1E5189 }	/* Main Complement color */
// .color-complement-1 { color: #5887BC }
// .color-complement-2 { color: #4A6D95 }
// .color-complement-3 { color: #1B2E44 }
// .color-complement-4 { color: #042448 }
