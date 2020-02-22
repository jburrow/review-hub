import { ReviewCommentStore } from "monaco-review";
export interface AppState {
    selectedFile?: {
        fullPath: string;
    };
    selectedView?: {
        fullPath: string;
        text: string;
        original?: string;
        label?: string;
    };
}
export interface SelectedView {
    fullPath: string;
    label?: string;
    text: string;
    original?: string;
    comments?: ReviewCommentStore;
}
export declare type AppStateEvents = {
    type: 'selectScript';
    fullPath: string;
} | {
    type: 'selectedView';
} & SelectedView;
export declare const reducer: (state: AppState, event: AppStateEvents) => AppState | {
    selectedView: {
        fullPath: string;
        text: string;
        original: string;
        label: string;
        comments: ReviewCommentStore;
    };
    selectedFile?: {
        fullPath: string;
    };
};
export declare type AppDispatch = (event: AppStateEvents) => void;
