import { ReviewCommentStore } from "monaco-review";
import { VersionControlState, VersionControlCommitEvent, VersionControlCommitReset } from "./events-version-control";
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
export declare type XEvent = AppStateEvents | ({
    storeType: VersionControlStoreType;
} & VersionControlCommitEvent) | ({
    storeType: VersionControlStoreType;
} & VersionControlCommitReset);
export declare enum VersionControlStoreType {
    Working = 0,
    VersionControl = 1
}
export interface XState {
    appStore: AppState;
    vcStore: VersionControlState;
    wsStore: VersionControlState;
}
export declare const XReducer: (state: XState, event: XEvent) => XState;
