import * as React from "react";
export declare const RenameDialog: React.ComponentType<Pick<{
    open: boolean;
    onClose({ newFullPath: string, rename: boolean }: {
        newFullPath: any;
        rename: any;
    }): void;
    fullPath: string;
} & {
    classes: Record<"layout" | "editor" | "header_bar" | "version_control" | "script_history" | "vc_history" | "panel_content" | "panel_heading", string>;
}, "open" | "onClose" | "fullPath"> & import("@material-ui/core").StyledComponentProps<"layout" | "editor" | "header_bar" | "version_control" | "script_history" | "vc_history" | "panel_content" | "panel_heading">>;
