import * as RGL from "react-grid-layout";
import { VersionControlState } from "./events-version-control";
import { Editor } from "./panels/editor";
import { FileHistory } from "./panels/file-history";
import { SCMPanel } from "./panels/staging-scm";
import { Timeline } from "./panels/timeline";
import { AppState, Dispatch } from "./store";
import { AppStyles } from "./styles";
import React = require("react");

import { useWindowSize } from "rooks";

const ReactGridLayout = RGL.WidthProvider(RGL);

export interface Persistence {
  save: (store: VersionControlState) => Promise<boolean>;
  load: () => Promise<VersionControlState>;
}

export interface Action {
  title: string;
  handleClick(dispatch: Dispatch, store: AppState, name: string): void;
}

export const App = (props: { dispatch: Dispatch; store: AppState; buttons?: Action[]; name?: string }) => {
  const { innerHeight } = useWindowSize();

  return (
    <ReactGridLayout
      rowHeight={(innerHeight - 70) / 20}
      maxRows={20}
      compactType={"vertical"}
      cols={12}
      margin={[5, 5]}
      containerPadding={[5, 5]}
      useCSSTransforms={true}
      draggableCancel={"panel_content"}
      style={AppStyles.layout}
    >
      <div key="0.0" data-grid={{ x: 0, y: 0, w: 12, h: 2 }} style={AppStyles.header_bar}>
        <PanelHeading>Review-Hub : {props.name}</PanelHeading>
        <PanelContent>
          {props.buttons?.map((a, i) => (
            <button key={i} onClick={() => a.handleClick(props.dispatch, props.store, props.name)}>
              {a.title}
            </button>
          ))}
        </PanelContent>
      </div>

      <div key="0.1" data-grid={{ x: 0, y: 1, w: 3, h: 13 }} style={AppStyles.version_control}>
        <PanelHeading>
          version-control {props.store.isHeadCommit ? props.store.interactionStore.selectedCommitId : "HEAD"}
          {props.store.isHeadCommit && (
            <button onClick={() => props.dispatch({ type: "selectCommit", commitId: null })}>Switch to HEAD</button>
          )}
        </PanelHeading>
        <PanelContent>
          <SCMPanel store={props.store} dispatch={props.dispatch} />
        </PanelContent>
      </div>

      <div key="0.2" data-grid={{ x: 3, y: 1, w: 6, h: 13 }} style={AppStyles.editor}>
        <PanelHeading>
          {!props.store.interactionStore.selectedView?.fullPath
            ? "Editor"
            : `Editor - ${props.store.interactionStore.selectedView?.fullPath} @ ${
                props.store.interactionStore.selectedView?.revision
              } ${props.store.interactionStore.selectedView?.label || ""}`}
        </PanelHeading>

        <PanelContent>
          <Editor
            currentUser={props.store.interactionStore.currentUser}
            view={props.store.interactionStore.selectedView}
            dispatch={props.dispatch}
          />
        </PanelContent>
      </div>
      <div key="0.3" data-grid={{ x: 9, y: 1, w: 3, h: 13 }} style={AppStyles.script_history}>
        <PanelHeading>File History {props.store.interactionStore.selectedView?.fullPath}</PanelHeading>

        <PanelContent>
          <FileHistory store={props.store} dispatch={props.dispatch} />
        </PanelContent>
      </div>
      <div key="1.1" data-grid={{ x: 0, y: 2, w: 12, h: 4 }} style={AppStyles.vc_history}>
        <PanelHeading>Timeline</PanelHeading>
        <PanelContent>
          <Timeline
            store={props.store}
            dispatch={props.dispatch}
            selectedCommitId={props.store.interactionStore.selectedCommitId}
            selectedView={props.store.interactionStore.selectedView}
          />
          <div>{props.store.vcStore.version}</div>
        </PanelContent>
      </div>
    </ReactGridLayout>
  );
};

export const PanelContent = (props: { children: any }) => {
  return (
    <div style={AppStyles.panel_content} onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
      {props.children}
    </div>
  );
};
export const PanelHeading = (props: { children: any }) => {
  return <div style={AppStyles.panel_heading}>{props.children}</div>;
};
