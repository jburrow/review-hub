import { ReviewCommentStore } from "monaco-review";
import { VersionControlStoreType } from "./store";

export interface InteractionState {
  selectedCommitId?: string;
  selectedView?: SelectedView;
  currentUser: string;
}

export interface SelectedView {
  storeType: VersionControlStoreType;
  fullPath: string;
  label?: string;
  text: string;
  original?: string;
  comments?: ReviewCommentStore;
  revision: number;
  originalRevision?: number;
  readOnly: boolean;
}
export type InteractionStateEvents =
  | { type: "selectCommit"; commitId: string }
  | { type: "selectedView"; selectedView: SelectedView }
  | { type: "setCurrentUser"; user: string };

export const interactionReducer = (state: InteractionState, event: InteractionStateEvents): InteractionState => {
  switch (event.type) {
    case "setCurrentUser":
      return { ...state, currentUser: event.user };

    case "selectCommit":
      return { ...state, selectedCommitId: event.commitId };

    case "selectedView":
      return {
        ...state,
        selectedView: event.selectedView,
      };
  }
  return state;
};
