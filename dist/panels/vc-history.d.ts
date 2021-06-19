import * as React from "react";
import { FileEvents } from "../events-version-control";
import { AppState, Dispatch } from "../store";
import { SelectedView } from "../interaction-store";
import { ReviewCommentEvent } from "monaco-review";
export declare const VCHistory: (props: {
    store: AppState;
    dispatch: Dispatch;
    selectedCommitId: string;
    selectedView: SelectedView;
}) => JSX.Element;
export declare const renderFileEvent: (e: FileEvents) => JSX.Element;
export declare const renderCommentEvent: (e: ReviewCommentEvent) => JSX.Element;
export declare const SelectCommitButton: React.ComponentType<Pick<{
    commitId: string;
    dispatch: Dispatch;
    selected: boolean;
} & {
    classes: import("@material-ui/styles").ClassNameMap<"selectedItem" | "inactiveItem">;
}, "selected" | "dispatch" | "commitId"> & import("@material-ui/core").StyledComponentProps<"selectedItem" | "inactiveItem">>;
export declare const SelectEditButton: React.ComponentType<Pick<{
    commitId: string;
    store: AppState;
    dispatch: Dispatch;
    editEvent: FileEvents;
    selectedView: SelectedView;
} & {
    classes: import("@material-ui/styles").ClassNameMap<"selectedItem" | "inactiveItem">;
}, "selectedView" | "dispatch" | "store" | "commitId" | "editEvent"> & import("@material-ui/core").StyledComponentProps<"selectedItem" | "inactiveItem">>;
