import * as React from "react";
import { VersionControlState, FileEditEvent, FileCommentEvent, FileRenameEvent } from "../events-version-control";
import { Dispatch } from "../store";
import { SelectedView } from "../interaction-store";
export declare const VCHistory: (props: {
    vcStore: VersionControlState;
    dispatch: Dispatch;
    selectedCommitId: string;
    selectedView: SelectedView;
}) => JSX.Element;
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
    editEvent: FileEditEvent | FileCommentEvent | FileRenameEvent;
    selectedView: SelectedView;
} & {
    classes: Record<"selectedItem" | "inactiveItem", string>;
}, "selectedView" | "dispatch" | "commitId" | "vcStore" | "editEvent"> & import("@material-ui/core").StyledComponentProps<"selectedItem" | "inactiveItem">>;
