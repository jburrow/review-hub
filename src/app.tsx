import { Button, withStyles, WithStyles } from "@material-ui/core";
import * as RGL from "react-grid-layout";
import {
  initialVersionControlState,
  VersionControlState,
} from "./events-version-control";
import { Editor } from "./panels/editor";
import { FileHistory } from "./panels/file-history";
import { SCMPanel } from "./panels/staging-scm";
import { VCHistory } from "./panels/vc-history";
import { appReducer, AppState, Dispatch } from "./store";
import { AppStyles } from "./styles";
import React = require("react");

import useWindowSize from "@rooks/use-window-size";
import { generateZip } from "./import-export";
import GetAppIcon from "@material-ui/icons/GetApp";

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

const initialState = {
  interactionStore: { currentUser: "xyz-user" },
  wsStore: initialVersionControlState(),
  vcStore: initialVersionControlState(),
};

export const App = withStyles(AppStyles)(
  (
    props: WithStyles<typeof AppStyles> & {
      persistence?: Persistence;
      currentUser?: string;
      options?: { loadOnStartup: boolean; showToolbar: boolean };
      panels?(
        dispatch: Dispatch,
        store: AppState,
        persistence: Persistence
      ): any[];
    }
  ) => {
    const persistence = props.persistence || new LocalStoragePersistence();
    const [store, dispatch] = React.useReducer(appReducer, initialState);
    const { innerHeight } = useWindowSize();

    React.useEffect(() => {
      if (props.options.loadOnStartup) {
        dispatch({ type: "load", vcStore: persistence.load() });
      }
    }, [props.options?.loadOnStartup]);

    React.useEffect(() => {
      if (props.currentUser) {
        dispatch({ type: "setCurrentUser", user: props.currentUser });
      }
    }, [props.currentUser]);

    const isHeadCommit =
      store.interactionStore.selectedCommitId &&
      store.vcStore.headCommitId != store.interactionStore.selectedCommitId;

    const panels = props.panels
      ? props.panels(dispatch, store, persistence)
      : [];
    console.log(panels, "panels");
    if (props.options.showToolbar) {
      panels.push(
        <div
          key="0.0"
          data-grid={{ x: 0, y: 0, w: 12, h: 2 }}
          className={props.classes.header_bar}
        >
          <PanelHeading>Review-Hub</PanelHeading>
          <PanelContent>
            <Button
              size="small"
              onClick={() =>
                dispatch({ type: "load", vcStore: persistence.load() })
              }
            >
              (Persistence) Load
            </Button>
            <Button
              size="small"
              onClick={() => persistence.save(store.vcStore)}
            >
              (Persistence) Save
            </Button>
            <Button
              size="small"
              onClick={() => {
                generateZip({
                  ...store.vcStore.files,
                  ...store.wsStore.files,
                });
              }}
              startIcon={<GetAppIcon />}
            >
              Download Code As Zip
            </Button>
          </PanelContent>
        </div>
      );
    }

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
        {panels}

        <div
          key="0.1"
          data-grid={{ x: 0, y: 1, w: 3, h: 13 }}
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
            <SCMPanel
              store={store}
              isHeadCommit={isHeadCommit}
              dispatch={dispatch}
            />
          </PanelContent>
        </div>

        <div
          key="0.2"
          data-grid={{ x: 3, y: 1, w: 6, h: 13 }}
          className={props.classes.editor}
        >
          <PanelHeading>
            {!store.interactionStore.selectedView?.fullPath
              ? "Editor"
              : `Editor - ${store.interactionStore.selectedView?.fullPath} @ ${
                  store.interactionStore.selectedView?.revision
                } ${store.interactionStore.selectedView?.label || ""}`}
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
          data-grid={{ x: 9, y: 1, w: 3, h: 13 }}
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
          data-grid={{ x: 0, y: 2, w: 12, h: 4 }}
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

export const PanelContent = withStyles(AppStyles)(
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
export const PanelHeading = withStyles(AppStyles)(
  (props: WithStyles<typeof AppStyles> & { children: any }) => {
    return <div className={props.classes.panel_heading}>{props.children}</div>;
  }
);
