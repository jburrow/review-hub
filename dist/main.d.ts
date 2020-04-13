import * as React from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./index.css";
interface Persistence {
    save: () => void;
    load: () => void;
}
export declare const App: React.ComponentType<Pick<{
    classes: Record<"layout" | "version_control" | "editor" | "script_history" | "vc_history" | "panel_content" | "panel_heading", string>;
} & {
    persistence?: Persistence;
}, "persistence"> & import("@material-ui/core").StyledComponentProps<"layout" | "version_control" | "editor" | "script_history" | "vc_history" | "panel_content" | "panel_heading">>;
export {};
