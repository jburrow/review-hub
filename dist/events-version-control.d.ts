import { ReviewCommentStore, ReviewCommentEvent } from "monaco-review";
export declare type FileEditEvent = {
    type: "edit";
    fullPath: string;
    text: string;
};
export declare type FileDeleteEvent = {
    type: "delete";
    fullPath: string;
};
export declare type FileCommentEvent = {
    type: "comment";
    fullPath: string;
    commentEvents: ReviewCommentEvent[];
};
export declare type FileRenameEvent = {
    type: "rename";
    fullPath: string;
    newFullPath: string;
    text: string;
};
export declare type FileEvents = FileEditEvent | FileDeleteEvent | FileRenameEvent | FileCommentEvent;
export declare type VersionControlEvent = {
    type: "commit";
    id?: string;
    author: string;
    events: FileEvents[];
} | {
    type: "reset";
    id?: string;
};
export declare enum FileStateStatus {
    active = 1,
    deleted = 2
}
export declare type FileState = {
    history: FileStateHistory[];
} & FileStateX;
export interface FileStateHistory {
    fileState: FileStateX;
    event: VersionControlEvent;
}
export declare type FileStateX = {
    fullPath: string;
    text: string;
    status: FileStateStatus;
    commentStore: ReviewCommentStore;
    revision: number;
};
export interface VersionControlState {
    files: Record<string, FileState>;
    version: number;
    events: VersionControlEvent[];
}
export declare function initialVersionControlState(): VersionControlState;
export declare type VCDispatch = (event: VersionControlEvent) => void;
export declare function versionControlReducer(state: VersionControlState, event: VersionControlEvent): VersionControlState;
export declare function reduceVersionControl(actions: VersionControlEvent[], state?: VersionControlState): VersionControlState;
