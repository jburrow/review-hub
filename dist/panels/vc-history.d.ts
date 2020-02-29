import * as React from "react";
import { VersionControlState, FileEditEvent, FileCommentEvent, FileRenameEvent } from "../events-version-control";
import { AppDispatch, SelectedView } from "../store";
export declare const VCHistory: (props: {
    vcStore: VersionControlState;
    appDispatch: AppDispatch;
    selectedCommitId: string;
    selectedView: SelectedView;
}) => JSX.Element;
export declare const SelectCommitButton: React.ComponentType<Pick<{
    commitId: string;
    appDispatch: AppDispatch;
    selected: boolean;
} & {
    classes: Record<"selectedItem" | "inactiveItem", string>;
}, "appDispatch" | "selected" | "commitId"> & import("@material-ui/core").StyledComponentProps<"selectedItem" | "inactiveItem">>;
export declare const SelectEditButton: React.ComponentType<Pick<{
    commitId: string;
    vcStore: VersionControlState;
    appDispatch: AppDispatch;
    editEvent: FileEditEvent | FileCommentEvent | FileRenameEvent;
    selectedView: SelectedView;
} & {
    classes: Record<"selectedItem" | "inactiveItem", string>;
}, "selectedView" | "appDispatch" | "commitId" | "vcStore" | "editEvent"> & import("@material-ui/core").StyledComponentProps<"selectedItem" | "inactiveItem">>;
