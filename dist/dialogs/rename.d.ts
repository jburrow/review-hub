import * as React from "react";
export declare const RenameDialog: React.ComponentType<Pick<{
    open: boolean;
    onClose({ newFullPath: string, rename: boolean }: {
        newFullPath: any;
        rename: any;
    }): void;
    fullPath: string;
} & {
    classes: Record<"layout" | "header_bar" | "version_control" | "editor" | "script_history" | "vc_history" | "panel_content" | "panel_heading", string>;
}, "open" | "fullPath" | "onClose"> & import("@material-ui/core").StyledComponentProps<"layout" | "header_bar" | "version_control" | "editor" | "script_history" | "vc_history" | "panel_content" | "panel_heading">>;
