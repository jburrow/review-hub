import * as React from "react";
import { VersionControlState } from "../events-version-control";
import { AppDispatch } from "../store";
export declare const VCHistory: (props: {
    vcStore: VersionControlState;
    appDispatch: AppDispatch;
    selectedCommitId: string;
}) => JSX.Element;
export declare const SelectCommitButton: React.ComponentType<Pick<{
    commitId: string;
    appDispatch: AppDispatch;
    selected: boolean;
} & {
    classes: Record<"selectedItem" | "inactiveItem", string>;
}, "appDispatch" | "selected" | "commitId"> & import("@material-ui/core").StyledComponentProps<"selectedItem" | "inactiveItem">>;
