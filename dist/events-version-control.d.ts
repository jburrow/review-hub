import { ReviewCommentStore, ReviewCommentEvent } from "monaco-review";
export declare type FileEditEvent = {
    type: "edit";
    fullPath: string;
    text: string;
    revision: Revision;
};
export declare type FileDeleteEvent = {
    type: "delete";
    fullPath: string;
    revision: Revision;
};
export declare type FileCommentEvent = {
    type: "comment";
    fullPath: string;
    commentEvents: ReviewCommentEvent[];
    revision: Revision;
};
export declare type FileRenameEvent = {
    type: "rename";
    fullPath: string;
    oldFullPath: string;
    text: string;
    revision: Revision;
};
export declare type GeneralComment = {
    type: "general-comment";
    commentEvents: ReviewCommentEvent[];
};
export declare type FileEvents = FileEditEvent | FileDeleteEvent | FileRenameEvent | FileCommentEvent | GeneralComment;
export declare type VersionControlEventBase = {
    id?: string;
    createdAt?: number;
};
export declare type VersionControlCommitEvent = {
    type: "commit";
    id?: string;
    author: string;
    events: FileEvents[];
    createdAt?: number;
} & VersionControlEventBase;
export declare type VersionControlCommitReset = {
    type: "reset";
} & VersionControlEventBase;
export declare type VersionControlInformationEvent = {
    type: "information";
    message: string;
    href?: string;
    title?: string;
    icon?: string;
} & VersionControlEventBase;
export declare type VersionControlEvent = VersionControlCommitEvent | VersionControlCommitReset | VersionControlInformationEvent;
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
    revision: Revision;
};
export declare type Files = Record<string, FileState>;
export declare type Revision = string;
export interface VersionControlState {
    files: Files;
    commits: Record<string, Files>;
    version: number;
    events: VersionControlEvent[];
    headCommitId: string;
    commentStore: ReviewCommentStore;
}
export declare function incrementRevision(revision: Revision): string;
export declare function initialVersionControlState(): VersionControlState;
export declare type VCDispatch = (event: VersionControlEvent) => void;
export declare function versionControlReducer(state: VersionControlState, event: VersionControlEvent): VersionControlState;
export declare function reduceVersionControl(actions: VersionControlEvent[], state?: VersionControlState): VersionControlState;
