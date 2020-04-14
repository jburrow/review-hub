import { VersionControlState } from "./events-version-control";
import React = require("react");
export interface Persistence {
    save: (store: VersionControlState) => void;
    load: () => VersionControlState;
}
export declare const App: React.ComponentType<Pick<{
    classes: Record<"layout" | "version_control" | "editor" | "script_history" | "vc_history" | "panel_content" | "panel_heading", string>;
} & {
    persistence?: Persistence;
}, "persistence"> & import("@material-ui/core").StyledComponentProps<"layout" | "version_control" | "editor" | "script_history" | "vc_history" | "panel_content" | "panel_heading">>;
