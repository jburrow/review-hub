import * as React from "react";
import { AppDispatch, SelectedView } from "../store";
import { FileState } from "../events-version-control";
export declare const FileHistory: React.ComponentType<Pick<{
    file: FileState;
    selectedView: SelectedView;
    appDispatch: AppDispatch;
} & {
    classes: Record<"selectedItem" | "inactiveItem", string>;
}, "selectedView" | "file" | "appDispatch"> & import("@material-ui/core").StyledComponentProps<"selectedItem" | "inactiveItem">>;
