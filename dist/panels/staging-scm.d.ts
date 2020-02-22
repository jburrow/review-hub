/// <reference types="react" />
import { AppDispatch } from "../store";
import { FileState } from "../events-version-control";
import { VersionControlEvent, VCDispatch } from "../events-version-control";
export declare const StagingSCM: (props: {
    wsfiles: Record<string, FileState>;
    vcfiles: Record<string, FileState>;
    events: VersionControlEvent[];
    wsDispatch: VCDispatch;
    vcDispatch: VCDispatch;
    appDispatch: AppDispatch;
    selectedFile: string;
}) => JSX.Element;
export declare const SCM: (props: {
    files: Record<string, FileState>;
    appDispatch: AppDispatch;
    selectedFile: string;
}) => JSX.Element;
