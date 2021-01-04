import { VersionControlState, VersionControlCommitEvent, VersionControlCommitReset } from "./events-version-control";
import { InteractionStateEvents, InteractionState } from "./interaction-store";
export declare type AppEvents = InteractionStateEvents | ({
    storeType: VersionControlStoreType;
} & VersionControlCommitEvent) | ({
    storeType: VersionControlStoreType;
} & VersionControlCommitReset) | {
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
}
export declare const appReducer: (state: AppState, event: AppEvents) => AppState;
