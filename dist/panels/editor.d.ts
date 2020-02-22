/// <reference types="react" />
import { SelectedView } from "../store";
import { VersionControlEvent } from "../events-version-control";
export declare const Editor: (props: {
    currentUser: string;
    view: SelectedView;
    wsDispatch(e: VersionControlEvent): void;
}) => JSX.Element;
