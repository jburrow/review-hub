import * as React from "react";
export declare const ConfirmDialog: React.ComponentType<Pick<{
    open: boolean;
    onClose(boolean: any): void;
    title: string;
    message: string;
} & {
    classes: Record<"layout" | "editor" | "header_bar" | "version_control" | "script_history" | "vc_history" | "panel_content" | "panel_heading", string>;
}, "open" | "message" | "title" | "onClose"> & import("@material-ui/core").StyledComponentProps<"layout" | "editor" | "header_bar" | "version_control" | "script_history" | "vc_history" | "panel_content" | "panel_heading">>;
