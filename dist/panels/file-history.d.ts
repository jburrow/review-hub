import * as React from "react";
import { AppState, Dispatch } from "../store";
import { FileStateHistory } from "../events-version-control";
import { SelectedView } from "../interaction-store";
export declare const FileHistoryItem: React.ComponentType<Pick<{
    history: FileStateHistory;
    selectedView: SelectedView;
} & {
    classes: Record<"selectedItem" | "inactiveItem", string>;
}, "history" | "selectedView"> & import("@material-ui/core").StyledComponentProps<"selectedItem" | "inactiveItem">>;
export declare const FileHistory: React.ComponentType<Pick<{
    dispatch: Dispatch;
    store: AppState;
} & {
    classes: Record<"selectedItem" | "inactiveItem", string>;
}, "dispatch" | "store"> & import("@material-ui/core").StyledComponentProps<"selectedItem" | "inactiveItem">>;
