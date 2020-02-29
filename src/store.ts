import { ReviewCommentStore } from "monaco-review";
import {
  VersionControlState,
  VersionControlCommitEvent,
  VersionControlCommitReset,
  versionControlReducer
} from "./events-version-control";

export interface AppState {
  selectedCommitId?: string;
  selectedFile?: string;
  selectedView?: SelectedView;
}

export interface SelectedView {
  fullPath: string;
  label: string;
  text: string;
  original?: string;
  comments?: ReviewCommentStore;
  revision: number;
  originalRevision?: number;
  readOnly: boolean;
}
export type AppStateEvents =
  //| { type: "selectScript"; fullPath: string }
  | { type: "selectCommit"; commitId: string }
  | ({ type: "selectedView" } & SelectedView);

export const reducer = (state: AppState, event: AppStateEvents): AppState => {
  switch (event.type) {
    case "selectCommit":
      return { ...state, selectedCommitId: event.commitId };
    // case "selectScript":
    //   return { ...state, selectedFile: event.fullPath };
    case "selectedView":
      return {
        ...state,
        selectedFile: event.fullPath,
        selectedView: {
          fullPath: event.fullPath,
          text: event.text,
          original: event.original,
          label: event.label,
          readOnly: event.readOnly,
          comments: event.comments,
          revision: event.revision,
          originalRevision: event.originalRevision
        }
      };
  }
  return state;
};

export type AppDispatch = (event: AppStateEvents) => void;

export type XEvent =
  | AppStateEvents
  | ({ storeType: VersionControlStoreType } & VersionControlCommitEvent)
  | ({ storeType: VersionControlStoreType } & VersionControlCommitReset);

export enum VersionControlStoreType {
  Working,
  VersionControl
}

export interface XState {
  appStore: AppState;
  vcStore: VersionControlState;
  wsStore: VersionControlState;
}

export const XReducer = (state: XState, event: XEvent): XState => {
  switch (event.type) {
    case "selectCommit":
    case "selectedView":
      return {
        ...state,
        appStore: reducer(state.appStore, event)
      };
    case "commit":
    case "reset":
      switch (event.storeType) {
        case VersionControlStoreType.VersionControl:
          const s2 = XReducer(
            {
              ...state,
              vcStore: versionControlReducer(state.vcStore, event)
            },
            {
              type: "reset",
              storeType: VersionControlStoreType.Working
            }
          );

          if (s2.appStore.selectedFile) {
            const c = s2.vcStore.files[state.appStore.selectedFile];
            return XReducer(s2, {
              type: "selectedView",
              fullPath: s2.appStore.selectedFile,
              revision: c.revision,
              text: c.text,
              readOnly: false,
              label: ""
            });
          }

          return s2;
        case VersionControlStoreType.Working:
          return {
            ...state,
            wsStore: versionControlReducer(state.wsStore, event)
          };
      }
  }
  return state;
};
