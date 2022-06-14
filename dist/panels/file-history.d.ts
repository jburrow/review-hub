import * as React from "react";
import { AppState, Dispatch } from "../store";
import { FileStateHistory } from "../events-version-control";
import { SelectedView } from "../interaction-store";
export declare const FileHistoryItem: React.ComponentType<Pick<{
    history: FileStateHistory;
    selectedView: SelectedView;
} & {
    classes: import("@material-ui/styles").ClassNameMap<"selectedItem" | "inactiveItem">;
}, "selectedView" | "history"> & import("@material-ui/core").StyledComponentProps<"selectedItem" | "inactiveItem">>;
export declare function timeConverter(timestamp: number): string;
export declare const FileHistory: React.ComponentType<Pick<{
    dispatch: Dispatch;
    store: AppState;
} & {
    classes: import("@material-ui/styles").ClassNameMap<"selectedItem" | "inactiveItem">;
}, "store" | "dispatch"> & import("@material-ui/core").StyledComponentProps<"selectedItem" | "inactiveItem">>;
