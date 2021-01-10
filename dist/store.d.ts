import { VersionControlState, VersionControlCommitEvent, VersionControlCommitReset } from "./events-version-control";
import { InteractionStateEvents, InteractionState } from "./interaction-store";
export declare type AppCommitEvent = {
    storeType: VersionControlStoreType;
} & VersionControlCommitEvent;
export declare type AppResetEvent = {
    storeType: VersionControlStoreType;
} & VersionControlCommitReset;
export declare type AppEvents = InteractionStateEvents | AppCommitEvent | AppResetEvent | {
    type: "load";
    vcStore?: VersionControlState;
    mainStore?: VersionControlState;
};
export declare enum VersionControlStoreType {
    Working = 0,
    Branch = 1,
    Main = 2
}
export declare function versionControlStoreTypeLabel(v: VersionControlStoreType): "Branch" | "Main" | "Working";
export declare type Dispatch = (event: AppEvents) => void;
export interface AppState {
    interactionStore: InteractionState;
    vcStore: VersionControlState;
    wsStore: VersionControlState;
    mainStore?: VersionControlState;
    isHeadCommit: boolean;
}
export declare const initialState: AppState;
export declare const appReducer: (state: AppState, event: AppEvents) => AppState;
export declare function getFile(store: AppState, storeType: VersionControlStoreType, fullPath: string): import("./events-version-control").FileState;
