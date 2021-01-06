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
    vcStore: VersionControlState;
};
export declare enum VersionControlStoreType {
    Working = 0,
    VersionControl = 1
}
export declare type Dispatch = (event: AppEvents) => void;
export interface AppState {
    interactionStore: InteractionState;
    vcStore: VersionControlState;
    wsStore: VersionControlState;
    isHeadCommit: boolean;
}
export declare const initialState: AppState;
export declare const appReducer: (state: AppState, event: AppEvents) => AppState;
