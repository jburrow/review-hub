import { VersionControlState } from "./events-version-control";
import { AppState, Dispatch } from "./store";
import React = require("react");
export interface Persistence {
    save: (store: VersionControlState) => Promise<boolean>;
    load: () => Promise<VersionControlState>;
}
export interface Action {
    title: string;
    handleClick(dispatch: Dispatch, store: AppState, name: string): void;
}
export declare const App: React.ComponentType<Pick<{
    classes: import("@material-ui/styles").ClassNameMap<"layout" | "editor" | "header_bar" | "version_control" | "script_history" | "vc_history" | "panel_content" | "panel_heading">;
} & {
    dispatch: Dispatch;
    store: AppState;
    buttons?: Action[];
    name?: string;
}, "name" | "dispatch" | "store" | "buttons"> & import("@material-ui/core").StyledComponentProps<"layout" | "editor" | "header_bar" | "version_control" | "script_history" | "vc_history" | "panel_content" | "panel_heading">>;
export declare const PanelContent: React.ComponentType<Pick<{
    classes: import("@material-ui/styles").ClassNameMap<"layout" | "editor" | "header_bar" | "version_control" | "script_history" | "vc_history" | "panel_content" | "panel_heading">;
} & {
    children: any;
}, "children"> & import("@material-ui/core").StyledComponentProps<"layout" | "editor" | "header_bar" | "version_control" | "script_history" | "vc_history" | "panel_content" | "panel_heading">>;
export declare const PanelHeading: React.ComponentType<Pick<{
    classes: import("@material-ui/styles").ClassNameMap<"layout" | "editor" | "header_bar" | "version_control" | "script_history" | "vc_history" | "panel_content" | "panel_heading">;
} & {
    children: any;
}, "children"> & import("@material-ui/core").StyledComponentProps<"layout" | "editor" | "header_bar" | "version_control" | "script_history" | "vc_history" | "panel_content" | "panel_heading">>;
