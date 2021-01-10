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
            debugger;
            return {
                ...state,
                selectedView: event.selectedView,
            };
    }
    return state;
};
exports.interactionReducer = interactionReducer;
//# sourceMappingURL=interaction-store.js.map