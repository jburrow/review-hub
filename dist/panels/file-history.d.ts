import * as React from "react";
import { AppState, Dispatch } from "../store";
export declare const FileHistory: React.ComponentType<Pick<{
    dispatch: Dispatch;
    store: AppState;
} & {
    classes: Record<"selectedItem" | "inactiveItem", string>;
}, "store" | "dispatch"> & import("@material-ui/core").StyledComponentProps<"selectedItem" | "inactiveItem">>;
