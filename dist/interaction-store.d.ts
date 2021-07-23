import { ReviewCommentStore } from "monaco-review";
import { Revision } from "./events-version-control";
import { VersionControlStoreType } from "./store";
export interface InteractionState {
    selectedCommitId?: string;
    selectedView?: SelectedView;
    currentUser: string;
}
interface SelectViewBase {
    storeType: VersionControlStoreType;
    fullPath: string;
    label?: string;
    text: string;
    comments?: ReviewCommentStore;
    revision: Revision;
    readOnly: boolean;
}
export interface SelectedSimpleView extends SelectViewBase {
    type: "view";
}
export interface SelectedDiffView extends SelectViewBase {
    type: "diff";
    original: string;
    originalRevision: Revision;
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
