/// <reference types="react" />
import { Dispatch } from "../store";
import { FileState } from "../events-version-control";
import { VersionControlEvent } from "../events-version-control";
export declare const StagingSCM: (props: {
    wsfiles: Record<string, FileState>;
    vcfiles: Record<string, FileState>;
    events: VersionControlEvent[];
    dispatch: Dispatch;
    selectedFile: string;
}) => JSX.Element;
export declare const SCM: (props: {
    files: Record<string, FileState>;
    dispatch: Dispatch;
    selectedFile: string;
    filter?(any: any): boolean;
}) => JSX.Element;
