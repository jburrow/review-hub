/// <reference types="react" />
import { VersionControlStoreType, Dispatch, AppState } from "../store";
import { FileState } from "../events-version-control";
import { VersionControlEvent } from "../events-version-control";
import { ReviewCommentStore } from "monaco-review";
import { SelectedView } from "../interaction-store";
export declare const StagingSCM: (props: {
    currentUser: string;
    wsfiles: Record<string, FileState>;
    vcfiles: Record<string, FileState>;
    events: VersionControlEvent[];
    generalComments: ReviewCommentStore;
    dispatch: Dispatch;
    selectedFile: SelectedView;
    isHeadCommit: boolean;
}) => JSX.Element;
export declare const SCM: (props: {
    storeType: VersionControlStoreType;
    files: Record<string, FileState>;
    comments: ReviewCommentStore;
    dispatch: Dispatch;
    selectedFile: SelectedView;
    currentUser: string;
    filter?(any: any): boolean;
}) => JSX.Element;
export declare const SCMPanel: (props: {
    dispatch: Dispatch;
    store: AppState;
}) => JSX.Element;
