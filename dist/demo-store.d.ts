import { VersionControlState } from "./events-version-control";
declare function loadVersionControlStore(): VersionControlState;
export declare const demoStore: {
    load: typeof loadVersionControlStore;
    save: (store: any) => any;
};
export {};
