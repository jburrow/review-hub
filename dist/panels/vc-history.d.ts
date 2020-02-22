import * as React from "react";
import { VersionControlState } from "../events-version-control";
import { AppDispatch } from "../store";
export declare const VCHistory: (props: {
    vcStore: VersionControlState;
    appDispatch: AppDispatch;
}) => JSX.Element;
export declare const SelectCommitButton: React.FunctionComponent<{
    commitId: string;
    appDispatch: AppDispatch;
}>;
