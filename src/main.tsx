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
import { appReducer } from "./store";
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

export const App = withStyles(AppStyles)(
  (props: WithStyles<typeof AppStyles>) => {
    const [store, dispatch] = React.useReducer(appReducer, {
      interactionStore: { currentUser: "xyz-user" },
      wsStore: initialVersionControlState(),
      vcStore: loadVersionControlStore()
    });

    const activeFiles = store.interactionStore.selectedCommitId
      ? store.vcStore.commits[store.interactionStore.selectedCommitId]
      : store.vcStore.files;

    const isHeadCommit =
      store.interactionStore.selectedCommitId &&
      store.vcStore.headCommitId != store.interactionStore.selectedCommitId;

    return (
      <ReactGridLayout
        rowHeight={30}
        maxRows={20}
        compactType={"vertical"}
        cols={12}
        margin={[5, 5]}
        containerPadding={[10, 10]}
        useCSSTransforms={true}
        draggableCancel={props.classes.panel_content}
        className={props.classes.layout}
      >
        <div
          key="0.0"
          data-grid={{ x: 0, y: 0, w: 12, h: 1 }}
          className={props.classes.version_control}
        >
          <button>Load</button>
          <button>Save</button>
          <button>Export Code</button>
          <button>Rebase</button>
        </div>
        <div
          key="0.1"
          data-grid={{ x: 0, y: 1, w: 3, h: 8 }}
          className={props.classes.version_control}
        >
          <div className={props.classes.panel_heading}>
            version-control{" "}
            {isHeadCommit ? store.interactionStore.selectedCommitId : "HEAD"}
            {isHeadCommit && (
              <button
                onClick={() =>
                  dispatch({ type: "selectCommit", commitId: null })
                }
              >
                Switch to HEAD
              </button>
            )}
          </div>
          <div className={props.classes.panel_content}>
            <SCM
              dispatch={dispatch}
              files={activeFiles}
              selectedFile={store.interactionStore.selectedFile}
              comments={store.vcStore.commentStore}
              filter={i => {
                return i[1].status === FileStateStatus.active;
              }}
            />
            Events: #{store.vcStore.events.length}
            <StagingSCM
              dispatch={dispatch}
              isHeadCommit={isHeadCommit}
              currentUser={store.interactionStore.currentUser}
              generalComments={store.wsStore.commentStore}
              events={store.wsStore.events}
              wsfiles={store.wsStore.files}
              vcfiles={store.vcStore.files}
              selectedFile={store.interactionStore.selectedFile}
            ></StagingSCM>
            Events: #{store.wsStore.events.length}
          </div>
        </div>

        <div
          key="0.2"
          data-grid={{ x: 3, y: 1, w: 6, h: 8 }}
          className={props.classes.editor}
        >
          <div className={props.classes.panel_heading}>
            Editor - {store.interactionStore.selectedView?.fullPath} -{" "}
            {store.interactionStore.selectedView?.label}
          </div>

          <div className={props.classes.panel_content}>
            <Editor
              currentUser={store.interactionStore.currentUser}
              view={store.interactionStore.selectedView}
              dispatch={dispatch}
            />
          </div>
        </div>
        <div
          key="0.3"
          data-grid={{ x: 9, y: 1, w: 3, h: 8 }}
          className={props.classes.script_history}
        >
          <div className={props.classes.panel_heading}>
            File History {store.interactionStore.selectedFile}
          </div>
          <div className={props.classes.panel_content}>
            <FileHistory
              file={
                store.interactionStore.selectedFile &&
                store.vcStore.files[store.interactionStore.selectedFile]
              }
              selectedView={store.interactionStore.selectedView}
              dispatch={dispatch}
            />
          </div>
        </div>
        <div
          key="1.1"
          data-grid={{ x: 0, y: 2, w: 12, h: 10 }}
          className={props.classes.vc_history}
        >
          <div className={props.classes.panel_heading}>VC History</div>
          <div className={props.classes.panel_content}>
            <VCHistory
              vcStore={store.vcStore}
              dispatch={dispatch}
              selectedCommitId={store.interactionStore.selectedCommitId}
              selectedView={store.interactionStore.selectedView}
            />
            <div>{store.vcStore.version}</div>
          </div>
        </div>
      </ReactGridLayout>
    );
  }
);

render(<App />, document.getElementById("root"));
