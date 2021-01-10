import { Persistence } from "./app";
import { VersionControlState, Files } from "./events-version-control";
export declare const demoStore: Persistence;
export declare function createFakeMainStore(files: Files): VersionControlState;
