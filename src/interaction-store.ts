import { ReviewCommentStore } from "monaco-review";

export interface InteractionState {
  selectedCommitId?: string;
  selectedFile?: string;
  selectedView?: SelectedView;
  currentUser: string;
}

export interface SelectedView {
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
  | ({ type: "selectedView" } & SelectedView)
  | { type: "setCurrentUser"; user: string };

export const interactionReducer = (
  state: InteractionState,
  event: InteractionStateEvents
): InteractionState => {
  switch (event.type) {
    case "setCurrentUser":
      return { ...state, currentUser: event.user };

    case "selectCommit":
      return { ...state, selectedCommitId: event.commitId };

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
          originalRevision: event.originalRevision,
        },
      };
  }
  return state;
};
