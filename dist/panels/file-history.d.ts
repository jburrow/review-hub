/// <reference types="react" />
import { AppState, Dispatch } from "../store";
import { FileStateHistory } from "../events-version-control";
import { SelectedView } from "../interaction-store";
export declare const FileHistoryItem: (props: {
    history: FileStateHistory;
    selectedView: SelectedView;
}) => JSX.Element;
export declare function timeConverter(timestamp: number): string;
export declare const FileHistory: (props: {
    dispatch: Dispatch;
    store: AppState;
}) => JSX.Element;
