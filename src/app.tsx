import { withStyles, WithStyles } from "@material-ui/core";
import * as RGL from "react-grid-layout";
import {
  FileStateStatus,
  initialVersionControlState,
  VersionControlState,
} from "./events-version-control";
import { Editor } from "./panels/editor";
import { FileHistory } from "./panels/file-history";
import { SCM, StagingSCM } from "./panels/staging-scm";
import { VCHistory } from "./panels/vc-history";
import { appReducer } from "./store";
import { AppStyles } from "./styles";
import React = require("react");

import useWindowSize from "@rooks/use-window-size";

const ReactGridLayout = RGL.WidthProvider(RGL);

export interface Persistence {
  save: (store: VersionControlState) => void;
  load: () => VersionControlState;
}

class LocalStoragePersistence implements Persistence {
  save(store: VersionControlState) {}
  load() {
    return initialVersionControlState();
  }
}

export const App = withStyles(AppStyles)(
  (props: WithStyles<typeof AppStyles> & { persistence?: Persistence }) => {
    const persistence = props.persistence || new LocalStoragePersistence();

    const [store, dispatch] = React.useReducer(appReducer, {
      interactionStore: { currentUser: "xyz-user" },
      wsStore: initialVersionControlState(),
      vcStore: persistence.load(),
    });

    const { innerHeight } = useWindowSize();

    const activeFiles = store.interactionStore.selectedCommitId
      ? store.vcStore.commits[store.interactionStore.selectedCommitId]
      : store.vcStore.files;

    const isHeadCommit =
      store.interactionStore.selectedCommitId &&
      store.vcStore.headCommitId != store.interactionStore.selectedCommitId;

    return (
      <ReactGridLayout
        rowHeight={(innerHeight - 70) / 20}
        maxRows={20}
        compactType={"vertical"}
        cols={12}
        margin={[5, 5]}
        containerPadding={[5, 5]}
        useCSSTransforms={true}
        draggableCancel={props.classes.panel_content}
        className={props.classes.layout}
      >
        <div
          key="0.0"
          data-grid={{ x: 0, y: 0, w: 12, h: 1 }}
          className={props.classes.header_bar}
        >
          <PanelHeading>Review-Hub</PanelHeading>

          {/* <button onClick={() => persistence.load}>Load</button> */}
          {/* <button onClick={() => persistence.save(store.vcStore)}>Save</button>
          <button
            onClick={() => {
              generateZip(store.vcStore);
            }}
          >
            Export Code
          </button> */}
          {/* <button disabled>Rebase</button> */}
        </div>
        <div
          key="0.1"
          data-grid={{ x: 0, y: 1, w: 3, h: 8 }}
          className={props.classes.version_control}
        >
          <PanelHeading>
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
          </PanelHeading>
          <PanelContent>
            <SCM
              dispatch={dispatch}
              files={activeFiles}
              selectedFile={store.interactionStore.selectedFile}
              comments={store.vcStore.commentStore}
              filter={(i) => {
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
          </PanelContent>
        </div>

        <div
          key="0.2"
          data-grid={{ x: 3, y: 1, w: 6, h: 8 }}
          className={props.classes.editor}
        >
          <PanelHeading>
            Editor - {store.interactionStore.selectedView?.fullPath} @
            {store.interactionStore.selectedView?.revision}
            {store.interactionStore.selectedView?.label}
          </PanelHeading>

          <PanelContent>
            <Editor
              currentUser={store.interactionStore.currentUser}
              view={store.interactionStore.selectedView}
              dispatch={dispatch}
            />
          </PanelContent>
        </div>
        <div
          key="0.3"
          data-grid={{ x: 9, y: 1, w: 3, h: 8 }}
          className={props.classes.script_history}
        >
          <PanelHeading>
            File History {store.interactionStore.selectedFile}
          </PanelHeading>

          <PanelContent>
            <FileHistory
              file={
                store.interactionStore.selectedFile &&
                store.vcStore.files[store.interactionStore.selectedFile]
              }
              selectedView={store.interactionStore.selectedView}
              dispatch={dispatch}
            />
          </PanelContent>
        </div>
        <div
          key="1.1"
          data-grid={{ x: 0, y: 2, w: 12, h: 10 }}
          className={props.classes.vc_history}
        >
          <PanelHeading>VC History</PanelHeading>
          <PanelContent>
            <VCHistory
              vcStore={store.vcStore}
              dispatch={dispatch}
              selectedCommitId={store.interactionStore.selectedCommitId}
              selectedView={store.interactionStore.selectedView}
            />
            <div>{store.vcStore.version}</div>
          </PanelContent>
        </div>
      </ReactGridLayout>
    );
  }
);

const PanelContent = withStyles(AppStyles)(
  (props: WithStyles<typeof AppStyles> & { children: any }) => {
    return (
      <div
        className={props.classes.panel_content}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {props.children}
      </div>
    );
  }
);
const PanelHeading = withStyles(AppStyles)(
  (props: WithStyles<typeof AppStyles> & { children: any }) => {
    return <div className={props.classes.panel_heading}>{props.children}</div>;
  }
);
