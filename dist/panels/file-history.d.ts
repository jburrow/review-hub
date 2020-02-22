/// <reference types="react" />
import { AppDispatch } from "../store";
import { FileState } from "../events-version-control";
export declare const FileHistory: (props: {
    file: FileState;
    appDispatch: AppDispatch;
}) => JSX.Element;
