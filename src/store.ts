import {
  VersionControlState,
  VersionControlCommitEvent,
  VersionControlCommitReset,
  versionControlReducer,
  initialVersionControlState,
} from "./events-version-control";
import { InteractionStateEvents, InteractionState, interactionReducer } from "./interaction-store";

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
      return "Branch";
    case VersionControlStoreType.Main:
      return "Main";
    case VersionControlStoreType.Working:
      return "Working";
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
  switch (event.type) {
    case "selectCommit":
    case "selectedView":
    case "setCurrentUser":
      const interactionStore = interactionReducer(state.interactionStore, event);
      return {
        ...state,
        interactionStore,
        isHeadCommit:
          interactionStore.selectedCommitId && state.vcStore.headCommitId != interactionStore.selectedCommitId,
      };
    case "load":
      return {
        ...state,
        vcStore: event.vcStore ?? state.vcStore,
        mainStore: event.mainStore ?? state.mainStore,
        wsStore: initialVersionControlState(),
      };
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
          let interactionStore = state.interactionStore;

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

          if (
            state.interactionStore?.selectedView?.fullPath === newSelectedPath &&
            !state.interactionStore?.selectedView?.readOnly
          ) {
            const value = wsStore.files[newSelectedPath];

            interactionStore = interactionReducer(state.interactionStore, {
              type: "selectedView",
              selectedView: value?.fullPath
                ? {
                    ...state.interactionStore.selectedView,
                    fullPath: value.fullPath,
                    readOnly: value && isReadonly(s1, value.fullPath, value.revision),
                    text: value.text,
                    comments: value.commentStore,
                    revision: value.revision,
                    storeType: VersionControlStoreType.Working,
                  }
                : null,
            });
          }

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
      return { storeType, file: store.mainStore?.files[fullPath] };

    case VersionControlStoreType.Working:
      if (store.wsStore?.files[fullPath]) {
        return { storeType, file: store.wsStore?.files[fullPath] };
      } else {
        return { storeType, file: store.vcStore?.files[fullPath] };
      }

    case VersionControlStoreType.Branch:
      return { storeType, file: store.vcStore?.files[fullPath] };

    default:
      return null;
  }
}

export function isReadonly(store: AppState, fullPath: string, revision: number) {
  let readOnly = true;
  //let headRevision = null;
  if (fullPath && revision) {
    const x = getFile(store, VersionControlStoreType.Working, fullPath);
    //headRevision = x.file.revision;
    readOnly = x.file.revision !== revision;
  }
  // console.log("ReadOnly:", fullPath, revision, headRevision, readOnly);
  return readOnly;
}
