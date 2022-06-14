/// <reference types="react" />
import { VersionControlState } from "./events-version-control";
import { AppState, Dispatch } from "./store";
export interface Persistence {
    save: (store: VersionControlState) => Promise<boolean>;
    load: () => Promise<VersionControlState>;
}
export interface Action {
    title: string;
    handleClick(dispatch: Dispatch, store: AppState, name: string): void;
}
export declare const App: (props: {
    dispatch: Dispatch;
    store: AppState;
    buttons?: Action[];
    name?: string;
}) => JSX.Element;
export declare const PanelContent: (props: {
    children: any;
}) => JSX.Element;
export declare const PanelHeading: (props: {
    children: any;
}) => JSX.Element;
