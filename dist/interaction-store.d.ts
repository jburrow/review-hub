import { ReviewCommentStore } from "monaco-review";
import { VersionControlStoreType } from "./store";
export interface InteractionState {
    selectedCommitId?: string;
    selectedView?: SelectedView;
    currentUser: string;
}
interface SelectedSimpleViewX {
    storeType: VersionControlStoreType;
    fullPath: string;
    label?: string;
    text: string;
    comments?: ReviewCommentStore;
    revision: number;
    readOnly: boolean;
}
export interface SelectedSimpleView extends SelectedSimpleViewX {
    type: "view";
}
export interface SelectedDiffView extends SelectedSimpleViewX {
    type: "diff";
    original: string;
    originalRevision: number;
    originalStoreType: VersionControlStoreType;
}
export declare type SelectedView = SelectedDiffView | SelectedSimpleView;
export declare type InteractionStateEvents = {
    type: "selectCommit";
    commitId: string;
} | {
    type: "selectedView";
    selectedView: SelectedView;
} | {
    type: "setCurrentUser";
    user: string;
};
export declare const interactionReducer: (state: InteractionState, event: InteractionStateEvents) => InteractionState;
export {};
