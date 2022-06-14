import * as React from "react";
export declare const TextInputDialog: React.ComponentType<Pick<{
    open: boolean;
    onClose({ text: string, confirm: boolean }: {
        text: any;
        confirm: any;
    }): void;
    title: string;
} & {
    classes: import("@material-ui/styles").ClassNameMap<"layout" | "header_bar" | "version_control" | "editor" | "script_history" | "vc_history" | "panel_content" | "panel_heading">;
}, "open" | "title" | "onClose"> & import("@material-ui/core").StyledComponentProps<"layout" | "header_bar" | "version_control" | "editor" | "script_history" | "vc_history" | "panel_content" | "panel_heading">>;
