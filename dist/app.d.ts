import { VersionControlState } from "./events-version-control";
import React = require("react");
export interface Persistence {
    save: (store: VersionControlState) => void;
    load: () => VersionControlState;
}
export declare const App: React.ComponentType<Pick<{
    classes: Record<"layout" | "header_bar" | "version_control" | "editor" | "script_history" | "vc_history" | "panel_content" | "panel_heading", string>;
} & {
    persistence?: Persistence;
    currentUser?: string;
    options?: {
        loadOnStartup: boolean;
    };
}, "persistence" | "currentUser" | "options"> & import("@material-ui/core").StyledComponentProps<"layout" | "header_bar" | "version_control" | "editor" | "script_history" | "vc_history" | "panel_content" | "panel_heading">>;
