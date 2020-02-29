/// <reference types="react" />
import { Dispatch } from "../store";
import { SelectedView } from "../interaction-store";
export declare const Editor: (props: {
    currentUser: string;
    view: SelectedView;
    dispatch: Dispatch;
}) => JSX.Element;
