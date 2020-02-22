import { ReviewCommentStore } from "monaco-review";

export interface AppState {
  selectedCommitId?: string;
  selectedFile?: { fullPath: string };
  selectedView?: SelectedView;
}

export interface SelectedView {
  fullPath: string;
  label?: string;
  text: string;
  original?: string;
  comments?: ReviewCommentStore;
}
export type AppStateEvents =
  | { type: "selectScript"; fullPath: string }
  | { type: "selectCommit"; commitId: string }
  | ({ type: "selectedView" } & SelectedView);

export const reducer = (state: AppState, event: AppStateEvents): AppState => {
  switch (event.type) {
    case "selectCommit":
      return { ...state, selectedCommitId: event.commitId };
    case "selectScript":
      return { ...state, selectedFile: { fullPath: event.fullPath } };
    case "selectedView":
      return {
        ...state,
        selectedView: {
          fullPath: event.fullPath,
          text: event.text,
          original: event.original,
          label: event.label,
          comments: event.comments
        }
      };
  }
  return state;
};

export type AppDispatch = (event: AppStateEvents) => void;
