import {
  VersionControlState,
  VersionControlCommitEvent,
  VersionControlCommitReset,
  versionControlReducer,
  isReadonly,
  initialVersionControlState,
} from "./events-version-control";
import {
  InteractionStateEvents,
  InteractionState,
  interactionReducer,
} from "./interaction-store";

export type AppCommitEvent = {
  storeType: VersionControlStoreType;
} & VersionControlCommitEvent;

export type AppResetEvent = {
  storeType: VersionControlStoreType;
} & VersionControlCommitReset;

export type AppEvents =
  | InteractionStateEvents
  | AppCommitEvent
  | AppResetEvent
  | { type: "load"; vcStore: VersionControlState };

export enum VersionControlStoreType {
  Working,
  VersionControl,
}
export type Dispatch = (event: AppEvents) => void;

export interface AppState {
  interactionStore: InteractionState;
  vcStore: VersionControlState;
  wsStore: VersionControlState;
  isHeadCommit: boolean;
}

export const initialState: AppState = {
  interactionStore: { currentUser: "xyz-user" },
  wsStore: initialVersionControlState(),
  vcStore: initialVersionControlState(),
  isHeadCommit: false,
};

export const appReducer = (state: AppState, event: AppEvents): AppState => {
  console.debug("appReducer:", event);
  switch (event.type) {
    case "selectCommit":
    case "selectedView":
    case "setCurrentUser":
      const interactionStore = interactionReducer(
        state.interactionStore,
        event
      );
      return {
        ...state,
        interactionStore,
        isHeadCommit:
          interactionStore.selectedCommitId &&
          state.vcStore.headCommitId != interactionStore.selectedCommitId,
      };
    case "load":
      return {
        ...state,
        vcStore: event.vcStore,
        wsStore: initialVersionControlState(),
      };
    case "commit":
    case "reset":
      switch (event.storeType) {
        case VersionControlStoreType.VersionControl:
          const isHeadCommit: boolean =
            state.interactionStore.selectedCommitId &&
            state.vcStore.headCommitId
              ? true
              : false;

          let s2 = appReducer(
            {
              ...state,
              vcStore: versionControlReducer(state.vcStore, event),
              isHeadCommit,
            },
            {
              type: "reset",
              storeType: VersionControlStoreType.Working,
            }
          );

          if (isHeadCommit) {
            s2 = appReducer(s2, {
              type: "selectCommit",
              commitId: null,
            });
          }

          return s2;
        case VersionControlStoreType.Working:
          let newSelectedPath = state.interactionStore.selectedView?.fullPath;
          let interactionStore = state.interactionStore;

          console.log(newSelectedPath);

          // if we are renaming of a revision ::  and it isn't in the working set... then do we need to seed it?
          if (event.type === "commit") {
            const rename = event.events.filter(
              (e) => e.type === "rename" && e.oldFullPath === newSelectedPath
            );

            if (rename.length > 0 && rename[0].type == "rename") {
              newSelectedPath = rename[0].fullPath;
            }
            if (
              event.events.filter(
                (e) => e.type === "delete" && e.fullPath === newSelectedPath
              ).length
            ) {
              newSelectedPath = null;
            }
          }

          const wsStore = versionControlReducer(state.wsStore, event);

          if (
            state.interactionStore?.selectedView?.fullPath ===
              newSelectedPath &&
            !state.interactionStore?.selectedView?.readOnly
          ) {
            const value = wsStore.files[newSelectedPath];

            interactionStore = interactionReducer(state.interactionStore, {
              type: "selectedView",
              fullPath: value?.fullPath,
              readOnly: value && isReadonly(value.history, value.revision),
              text: value?.text,
              comments: value?.commentStore,
              revision: value?.revision,
            });
          }

          //should handle whne you commit
          // should handle when viewing a deleted script
          // should disable buttons for rename and delete when you edit.

          return {
            ...state,
            wsStore,
            interactionStore,
          };
      }
  }
  return state;
};
