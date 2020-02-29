import * as React from "react";
import { Dispatch } from "../store";
import { FileState } from "../events-version-control";
import { SelectedView } from "../interaction-store";
export declare const FileHistory: React.ComponentType<Pick<{
    file: FileState;
    selectedView: SelectedView;
    dispatch: Dispatch;
} & {
    classes: Record<"selectedItem" | "inactiveItem", string>;
}, "selectedView" | "file" | "dispatch"> & import("@material-ui/core").StyledComponentProps<"selectedItem" | "inactiveItem">>;
