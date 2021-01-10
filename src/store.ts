import {
  VersionControlState,
  VersionControlCommitEvent,
  VersionControlCommitReset,
  versionControlReducer,
  isReadonly,
  initialVersionControlState,
} from "./events-version-control";
import { InteractionStateEvents, InteractionState, interactionReducer, SelectedView } from "./interaction-store";

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
  | {
      type: "load";
      vcStore?: VersionControlState;
      mainStore?: VersionControlState;
    };

export enum VersionControlStoreType {
  Working,
  Branch,
  Main,
}

export function versionControlStoreTypeLabel(v: VersionControlStoreType) {
  switch (v) {
    case VersionControlStoreType.Branch:
      return "branch";
    case VersionControlStoreType.Main:
      return "main";
    case VersionControlStoreType.Working:
      return "working";
  }
}

export type Dispatch = (event: AppEvents) => void;

export interface AppState {
  interactionStore: InteractionState;
  vcStore: VersionControlState;
  wsStore: VersionControlState;
  mainStore?: VersionControlState;
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
      const is1 = interactionReducer(state.interactionStore, event);
      return {
        ...state,
        interactionStore: is1,
        isHeadCommit: is1.selectedCommitId && state.vcStore.headCommitId != is1.selectedCommitId,
      };

    case "load":
      //TODO - anywhere that is calling the interaction reducer and not passing selectedView back to appReducer is wrong.
      const s1 = {
        ...state,
        vcStore: event.vcStore ?? state.vcStore,
        mainStore: event.mainStore ?? state.mainStore,
        wsStore: initialVersionControlState(),
      };

      const is2 = state.interactionStore?.selectedView
        ? refreshSelectedView(s1, state.interactionStore?.selectedView.fullPath)
        : s1.interactionStore;

      return { ...s1, interactionStore: is2 };
    case "commit":
    case "reset":
      switch (event.storeType) {
        case VersionControlStoreType.Branch:
          const isHeadCommit: boolean =
            state.interactionStore.selectedCommitId && state.vcStore.headCommitId ? true : false;

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

          // if we are renaming of a revision ::  and it isn't in the working set... then do we need to seed it?
          if (event.type === "commit") {
            const rename = event.events.filter((e) => e.type === "rename" && e.oldFullPath === newSelectedPath);

            if (rename.length > 0 && rename[0].type == "rename") {
              newSelectedPath = rename[0].fullPath;
            }
            if (event.events.filter((e) => e.type === "delete" && e.fullPath === newSelectedPath).length) {
              newSelectedPath = null;
            }
          }

          const wsStore = versionControlReducer(state.wsStore, event);

          const s1 = {
            ...state,
            wsStore,
          };

          const interactionStore =
            state.interactionStore?.selectedView &&
            state.interactionStore?.selectedView.fullPath === newSelectedPath &&
            !state.interactionStore?.selectedView.readOnly
              ? refreshSelectedView(s1, newSelectedPath)
              : state.interactionStore;

          //should handle whne you commit
          // should handle when viewing a deleted script
          // should disable buttons for rename and delete when you edit.

          return {
            ...s1,
            interactionStore,
          };
      }
  }
  return state;
};

export function getFile(store: AppState, storeType: VersionControlStoreType, fullPath: string) {
  switch (storeType) {
    case VersionControlStoreType.Main:
      return store.mainStore?.files[fullPath];

    case VersionControlStoreType.Working:
      return store.wsStore?.files[fullPath] || store.vcStore?.files[fullPath];

    case VersionControlStoreType.Branch:
      return store.vcStore?.files[fullPath];
  }
}

export function refreshSelectedView(state: AppState, newSelectedPath: string) {
  const value = getFile(state, state.interactionStore.selectedView.storeType, newSelectedPath);

  let selectedView: SelectedView = null;

  if (value) {
    selectedView = {
      ...state.interactionStore.selectedView,
      fullPath: value.fullPath,
      readOnly: value && isReadonly(value.history, value.revision),
      text: value.text,
      comments: value.commentStore,
      revision: value.revision,
    };
  }

  if (selectedView && selectedView.type == "diff") {
    const original = getFile(state, selectedView.originalStoreType, newSelectedPath);
    selectedView = {
      ...selectedView,
      original: original.text,
      originalRevision: original.revision,
    };
  }

  return interactionReducer(state.interactionStore, {
    type: "selectedView",
    selectedView,
  });
}
