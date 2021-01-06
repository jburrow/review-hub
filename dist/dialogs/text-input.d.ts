import * as React from "react";
export declare const TextInputDialog: React.ComponentType<Pick<{
    open: boolean;
    onClose({ text: string, confirm: boolean }: {
        text: any;
        confirm: any;
    }): void;
    title: string;
} & {
    classes: Record<"layout" | "editor" | "header_bar" | "version_control" | "script_history" | "vc_history" | "panel_content" | "panel_heading", string>;
}, "open" | "title" | "onClose"> & import("@material-ui/core").StyledComponentProps<"layout" | "editor" | "header_bar" | "version_control" | "script_history" | "vc_history" | "panel_content" | "panel_heading">>;
