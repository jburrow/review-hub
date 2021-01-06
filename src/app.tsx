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
import { appReducer, AppState, Dispatch, initialState } from "./store";
import { AppStyles } from "./styles";
import React = require("react");

import useWindowSize from "@rooks/use-window-size";

const ReactGridLayout = RGL.WidthProvider(RGL);

export interface Persistence {
  save: (store: VersionControlState) => Promise<boolean>;
  load: () => Promise<VersionControlState>;
}

class LocalStoragePersistence implements Persistence {
  async save(store: VersionControlState): Promise<boolean> {
    return new Promise<boolean>((resolve) => resolve(true));
  }
  async load(): Promise<VersionControlState> {
    return new Promise<VersionControlState>((resolve) =>
      resolve(initialVersionControlState())
    );
  }
}

export interface Action {
  title: string;
  handleClick(
    dispatch: Dispatch,
    store: AppState,
    persistence: Persistence,
    currentUser: string,
    name: string
  ): void;
}

export const App = withStyles(AppStyles)(
  (
    props: WithStyles<typeof AppStyles> & {
      persistence?: Persistence;
      currentUser?: string;
      options?: { loadOnStartup?: boolean };
      buttons?: Action[];
      name?: string;
    }
  ) => {
    const persistence = props.persistence ?? new LocalStoragePersistence();
    const [store, dispatch] = React.useReducer(appReducer, initialState);
    const { innerHeight } = useWindowSize();

    React.useEffect(() => {
      const effect = async () => {
        if (props.options.loadOnStartup) {
          dispatch({ type: "load", vcStore: await persistence.load() });
        }
      };

      effect();
    }, [props.options?.loadOnStartup]);

    React.useEffect(() => {
      if (props.currentUser) {
        dispatch({ type: "setCurrentUser", user: props.currentUser });
      }
    }, [props.currentUser]);

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
          data-grid={{ x: 0, y: 0, w: 12, h: 2 }}
          className={props.classes.header_bar}
        >
          <PanelHeading>Review-Hub : {props.name}</PanelHeading>
          <PanelContent>
            {props.buttons?.map((a) => (
              <Button
                onClick={() =>
                  a.handleClick(
                    dispatch,
                    store,
                    persistence,
                    props.currentUser,
                    props.name
                  )
                }
              >
                {a.title}
              </Button>
            ))}
          </PanelContent>
        </div>

        <div
          key="0.1"
          data-grid={{ x: 0, y: 1, w: 3, h: 13 }}
          className={props.classes.version_control}
        >
          <PanelHeading>
            version-control{" "}
            {store.isHeadCommit
              ? store.interactionStore.selectedCommitId
              : "HEAD"}
            {store.isHeadCommit && (
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
            <SCMPanel store={store} dispatch={dispatch} />
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
