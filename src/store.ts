import {
  VersionControlState,
  VersionControlCommitEvent,
  VersionControlCommitReset,
  versionControlReducer
} from "./events-version-control";
import {
  InteractionStateEvents,
  InteractionState,
  interactionReducer
} from "./interaction-store";

export type AppEvents =
  | InteractionStateEvents
  | ({ storeType: VersionControlStoreType } & VersionControlCommitEvent)
  | ({ storeType: VersionControlStoreType } & VersionControlCommitReset);

export enum VersionControlStoreType {
  Working,
  VersionControl
}
export type Dispatch = (event: AppEvents) => void;

export interface AppState {
  interactionStore: InteractionState;
  vcStore: VersionControlState;
  wsStore: VersionControlState;
}

export const appReducer = (state: AppState, event: AppEvents): AppState => {
  switch (event.type) {
    case "selectCommit":
    case "selectedView":
      return {
        ...state,
        interactionStore: interactionReducer(state.interactionStore, event)
      };
    case "commit":
    case "reset":
      switch (event.storeType) {
        case VersionControlStoreType.VersionControl:
          const vcSelectedFile =
            state.vcStore.files[state.interactionStore.selectedFile];
          const isSelectedHead =
            state.interactionStore.selectedFile &&
            vcSelectedFile &&
            vcSelectedFile.revision ===
              state.interactionStore.selectedView.revision;

          const isCommitIdHead =
            state.interactionStore.selectedCommitId &&
            state.vcStore.headCommitId;

          let s2 = appReducer(
            {
              ...state,
              vcStore: versionControlReducer(state.vcStore, event)
            },
            {
              type: "reset",
              storeType: VersionControlStoreType.Working
            }
          );

          if (isSelectedHead) {
            const c = s2.vcStore.files[state.interactionStore.selectedFile];
            s2 = appReducer(s2, {
              type: "selectedView",
              fullPath: s2.interactionStore.selectedFile,
              revision: c.revision,
              text: c.text,
              readOnly: false,
              label: ""
            });
          }

          if (isCommitIdHead) {
            s2 = appReducer(s2, {
              type: "selectCommit",
              commitId: null
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
