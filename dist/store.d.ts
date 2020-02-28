import { ReviewCommentStore } from "monaco-review";
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
export declare type AppStateEvents = {
    type: "selectCommit";
    commitId: string;
} | ({
    type: "selectedView";
} & SelectedView);
export declare const reducer: (state: AppState, event: AppStateEvents) => AppState;
export declare type AppDispatch = (event: AppStateEvents) => void;
