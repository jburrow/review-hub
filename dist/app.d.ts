import { VersionControlState } from "./events-version-control";
import { AppState, Dispatch } from "./store";
import React = require("react");
export interface Persistence {
    save: (store: VersionControlState) => Promise<boolean>;
    load: () => Promise<VersionControlState>;
}
export declare const App: React.ComponentType<Pick<{
    classes: Record<"layout" | "header_bar" | "version_control" | "editor" | "script_history" | "vc_history" | "panel_content" | "panel_heading", string>;
} & {
    persistence?: Persistence;
    currentUser?: string;
    options?: {
        loadOnStartup: boolean;
        showToolbar: boolean;
    };
    panels?(dispatch: Dispatch, store: AppState, persistence: Persistence): any[];
}, "persistence" | "currentUser" | "options" | "panels"> & import("@material-ui/core").StyledComponentProps<"layout" | "header_bar" | "version_control" | "editor" | "script_history" | "vc_history" | "panel_content" | "panel_heading">>;
export declare const PanelContent: React.ComponentType<Pick<{
    classes: Record<"layout" | "header_bar" | "version_control" | "editor" | "script_history" | "vc_history" | "panel_content" | "panel_heading", string>;
} & {
    children: any;
}, "children"> & import("@material-ui/core").StyledComponentProps<"layout" | "header_bar" | "version_control" | "editor" | "script_history" | "vc_history" | "panel_content" | "panel_heading">>;
export declare const PanelHeading: React.ComponentType<Pick<{
    classes: Record<"layout" | "header_bar" | "version_control" | "editor" | "script_history" | "vc_history" | "panel_content" | "panel_heading", string>;
} & {
    children: any;
}, "children"> & import("@material-ui/core").StyledComponentProps<"layout" | "header_bar" | "version_control" | "editor" | "script_history" | "vc_history" | "panel_content" | "panel_heading">>;
