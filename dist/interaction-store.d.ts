import { ReviewCommentStore } from "monaco-review";
export interface InteractionState {
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
export declare type InteractionStateEvents = {
    type: "selectCommit";
    commitId: string;
} | ({
    type: "selectedView";
} & SelectedView);
export declare const interactionReducer: (state: InteractionState, event: InteractionStateEvents) => InteractionState;
