import * as React from "react";
export declare const ConfirmDialog: React.ComponentType<Pick<{
    open: boolean;
    onClose(boolean: any): void;
    title: string;
    message: string;
} & {
    classes: import("@material-ui/styles").ClassNameMap<"layout" | "editor" | "header_bar" | "version_control" | "script_history" | "vc_history" | "panel_content" | "panel_heading">;
}, "open" | "title" | "onClose" | "message"> & import("@material-ui/core").StyledComponentProps<"layout" | "editor" | "header_bar" | "version_control" | "script_history" | "vc_history" | "panel_content" | "panel_heading">>;
