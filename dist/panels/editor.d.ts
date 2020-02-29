/// <reference types="react" />
import { SelectedView, XEvent } from "../store";
export declare const Editor: (props: {
    currentUser: string;
    view: SelectedView;
    dispatch(e: XEvent): void;
}) => JSX.Element;
