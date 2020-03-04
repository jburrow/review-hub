/// <reference types="react" />
import { Dispatch } from "../store";
import { FileState } from "../events-version-control";
import { VersionControlEvent } from "../events-version-control";
import { ReviewCommentStore } from "monaco-review";
export declare const StagingSCM: (props: {
    currentUser: string;
    wsfiles: Record<string, FileState>;
    vcfiles: Record<string, FileState>;
    events: VersionControlEvent[];
    generalComments: ReviewCommentStore;
    dispatch: Dispatch;
    selectedFile: string;
    isHeadCommit: boolean;
}) => JSX.Element;
export declare const SCM: (props: {
    files: Record<string, FileState>;
    comments: ReviewCommentStore;
    dispatch: Dispatch;
    selectedFile: string;
    filter?(any: any): boolean;
}) => JSX.Element;
