/// <reference types="react" />
import { VersionControlCommitEvent, FileEvents } from "../events-version-control";
import { AppState, Dispatch } from "../store";
import { SelectedView } from "../interaction-store";
import { ReviewCommentEvent } from "monaco-review";
export declare const Timeline: (props: {
    store: AppState;
    dispatch: Dispatch;
    selectedCommitId: string;
    selectedView: SelectedView;
}) => JSX.Element;
export declare const VersionControlCommitEventComponent: (props: {
    dispatch: Dispatch;
    idx: number;
    scid: string;
    ce: VersionControlCommitEvent;
    selectedView: SelectedView;
    store: AppState;
}) => JSX.Element;
export declare const renderFileEvent: (e: FileEvents) => JSX.Element;
export declare const Chip: (props: {
    label: string;
    color?: string;
    size?: string;
    variant?: string;
}) => JSX.Element;
export declare const renderCommentEvent: (e: ReviewCommentEvent) => JSX.Element;
export declare const SelectCommitButton: (props: {
    commitId: string;
    dispatch: Dispatch;
    selected: boolean;
}) => JSX.Element;
export declare const SelectEditButton: (props: {
    commitId: string;
    store: AppState;
    dispatch: Dispatch;
    editEvent: FileEvents;
    selectedView: SelectedView;
}) => JSX.Element;
