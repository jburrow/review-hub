/// <reference types="react" />
import { AppDispatch } from "../store";
import { FileState } from "../events-version-control";
export declare const History: (props: {
    script: FileState;
    appDispatch: AppDispatch;
}) => JSX.Element;
