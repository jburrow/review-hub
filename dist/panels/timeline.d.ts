import * as React from "react";
import { VersionControlCommitEvent, FileEvents } from "../events-version-control";
import { AppState, Dispatch } from "../store";
import { SelectedView } from "../interaction-store";
import { ReviewCommentEvent } from "monaco-review";
export declare const Timeline: (props: {
    store: AppState;
    dispatch: Dispatch;
    selectedCommitId: string;
    selectedView: SelectedView;
}) => JSX.Element;
export declare const VersionControlCommitEventComponent: (props: {
    dispatch: Dispatch;
    idx: number;
    scid: string;
    ce: VersionControlCommitEvent;
    selectedView: SelectedView;
    store: AppState;
}) => JSX.Element;
export declare const renderFileEvent: (e: FileEvents) => JSX.Element;
export declare const renderCommentEvent: (e: ReviewCommentEvent) => JSX.Element;
export declare const SelectCommitButton: React.ComponentType<Pick<{
    commitId: string;
    dispatch: Dispatch;
    selected: boolean;
} & {
    classes: import("@material-ui/styles").ClassNameMap<"selectedItem" | "inactiveItem">;
}, "commitId" | "dispatch" | "selected"> & import("@material-ui/core").StyledComponentProps<"selectedItem" | "inactiveItem">>;
export declare const SelectEditButton: React.ComponentType<Pick<{
    commitId: string;
    store: AppState;
    dispatch: Dispatch;
    editEvent: FileEvents;
    selectedView: SelectedView;
} & {
    classes: import("@material-ui/styles").ClassNameMap<"selectedItem" | "inactiveItem">;
}, "commitId" | "dispatch" | "store" | "editEvent" | "selectedView"> & import("@material-ui/core").StyledComponentProps<"selectedItem" | "inactiveItem">>;
