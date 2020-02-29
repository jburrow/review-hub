import {
  VersionControlState,
  VersionControlCommitEvent,
  VersionControlCommitReset,
  versionControlReducer
} from "./events-version-control";
import { AppStateEvents, AppState, reducer } from "./app-store";

export type XEvent =
  | AppStateEvents
  | ({ storeType: VersionControlStoreType } & VersionControlCommitEvent)
  | ({ storeType: VersionControlStoreType } & VersionControlCommitReset);

export enum VersionControlStoreType {
  Working,
  VersionControl
}
export type Dispatch = (event: XEvent) => void;

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
