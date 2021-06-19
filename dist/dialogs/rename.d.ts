import * as React from "react";
export declare const RenameDialog: React.ComponentType<Pick<{
    open: boolean;
    onClose({ newFullPath: string, rename: boolean }: {
        newFullPath: any;
        rename: any;
    }): void;
    fullPath: string;
} & {
    classes: import("@material-ui/styles").ClassNameMap<"layout" | "header_bar" | "version_control" | "editor" | "script_history" | "vc_history" | "panel_content" | "panel_heading">;
}, "open" | "onClose" | "fullPath"> & import("@material-ui/core").StyledComponentProps<"layout" | "header_bar" | "version_control" | "editor" | "script_history" | "vc_history" | "panel_content" | "panel_heading">>;
