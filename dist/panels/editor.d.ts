/// <reference types="react" />
import 'react-resizable/css/styles.css';
import 'react-grid-layout/css/styles.css';
import { SelectedView } from "../store";
import { VersionControlEvent } from "../events-version-control";
export declare const Editor: (props: {
    currentUser: string;
    view: SelectedView;
    wsDispatch(e: VersionControlEvent): void;
}) => JSX.Element;
