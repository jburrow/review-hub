"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interactionReducer = void 0;
const interactionReducer = (state, event) => {
    switch (event.type) {
        case "setCurrentUser":
            return { ...state, currentUser: event.user };
        case "selectCommit":
            return { ...state, selectedCommitId: event.commitId };
        case "selectedView":
            return {
                ...state,
                //selectedFile: event.fullPath,
                selectedView: {
                    fullPath: event.fullPath,
                    text: event.text,
                    original: event.original,
                    label: event.label,
                    readOnly: event.readOnly,
                    comments: event.comments,
                    revision: event.revision,
                    originalRevision: event.originalRevision,
                },
            };
    }
    return state;
};
exports.interactionReducer = interactionReducer;
//# sourceMappingURL=interaction-store.js.map