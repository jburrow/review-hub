import { ReviewCommentStore } from "monaco-review";
import { VersionControlStoreType } from "./store";

export interface InteractionState {
  selectedCommitId?: string;
  selectedView?: SelectedView;
  currentUser: string;
}

interface SelectViewBase {
  storeType: VersionControlStoreType;
  fullPath: string;
  text: string;
  comments?: ReviewCommentStore;
  revision: number;
  readOnly: boolean;
}

export interface SelectedSimpleView extends SelectViewBase {
  type: "view";
}

export interface SelectedDiffView extends SelectViewBase {
  type: "diff";
  label: string;
  original: string;
  originalRevision: number;
  originalStoreType: VersionControlStoreType;
}

export type SelectedView = SelectedDiffView | SelectedSimpleView;

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
