import { FileState } from "./events-version-control";
import { AppCommitEvent } from "./store";
export declare function generateZip(files: Record<string, FileState>): Promise<void>;
export declare function rebaseScripts(author: string, currentFiles: Record<string, FileState>, files: Record<string, FileState>): AppCommitEvent;
