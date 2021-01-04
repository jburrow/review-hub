import * as React from "react";
import { VersionControlState, FileEvents } from "../events-version-control";
import { Dispatch } from "../store";
import { SelectedView } from "../interaction-store";
import { ReviewCommentEvent } from "monaco-review";
export declare const VCHistory: (props: {
    vcStore: VersionControlState;
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
    classes: Record<"selectedItem" | "inactiveItem", string>;
}, "dispatch" | "selected" | "commitId"> & import("@material-ui/core").StyledComponentProps<"selectedItem" | "inactiveItem">>;
export declare const SelectEditButton: React.ComponentType<Pick<{
    commitId: string;
    vcStore: VersionControlState;
    dispatch: Dispatch;
    editEvent: FileEvents;
    selectedView: SelectedView;
} & {
    classes: Record<"selectedItem" | "inactiveItem", string>;
}, "dispatch" | "selectedView" | "commitId" | "vcStore" | "editEvent"> & import("@material-ui/core").StyledComponentProps<"selectedItem" | "inactiveItem">>;
