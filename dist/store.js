"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appReducer = exports.VersionControlStoreType = void 0;
const events_version_control_1 = require("./events-version-control");
const interaction_store_1 = require("./interaction-store");
var VersionControlStoreType;
(function (VersionControlStoreType) {
    VersionControlStoreType[VersionControlStoreType["Working"] = 0] = "Working";
    VersionControlStoreType[VersionControlStoreType["VersionControl"] = 1] = "VersionControl";
})(VersionControlStoreType = exports.VersionControlStoreType || (exports.VersionControlStoreType = {}));
const appReducer = (state, event) => {
    switch (event.type) {
        case "selectCommit":
        case "selectedView":
        case "setCurrentUser":
            return {
                ...state,
                interactionStore: interaction_store_1.interactionReducer(state.interactionStore, event),
            };
        case "load":
            return {
                ...state,
                vcStore: event.vcStore,
                wsStore: events_version_control_1.initialVersionControlState(),
            };
        case "commit":
        case "reset":
            switch (event.storeType) {
                case VersionControlStoreType.VersionControl:
                    const vcSelectedFile = state.vcStore.files[state.interactionStore.selectedFile];
                    const isSelectedHead = state.interactionStore.selectedFile &&
                        vcSelectedFile &&
                        vcSelectedFile.revision ===
                            state.interactionStore.selectedView.revision;
                    const isCommitIdHead = state.interactionStore.selectedCommitId &&
                        state.vcStore.headCommitId;
                    let s2 = exports.appReducer({
                        ...state,
                        vcStore: events_version_control_1.versionControlReducer(state.vcStore, event),
                    }, {
                        type: "reset",
                        storeType: VersionControlStoreType.Working,
                    });
                    if (isSelectedHead) {
                        const c = s2.vcStore.files[state.interactionStore.selectedFile];
                        s2 = exports.appReducer(s2, {
                            type: "selectedView",
                            fullPath: s2.interactionStore.selectedFile,
                            revision: c.revision,
                            text: c.text,
                            readOnly: false,
                        });
                    }
                    if (isCommitIdHead) {
                        s2 = exports.appReducer(s2, {
                            type: "selectCommit",
                            commitId: null,
                        });
                    }
                    return s2;
                case VersionControlStoreType.Working:
                    let newSelectedPath = state.interactionStore.selectedFile;
                    let interactionStore = state.interactionStore;
                    // if we are renaming of a revision ::  and it isn't in the working set... then do we need to seed it?
                    if (event.type === "commit") {
                        const rename = event.events.filter((e) => e.type === "rename" &&
                            e.oldFullPath === state.interactionStore.selectedFile);
                        if (rename.length > 0 && rename[0].type == "rename") {
                            newSelectedPath = rename[0].fullPath;
                        }
                        if (event.events.filter((e) => e.type === "delete" &&
                            e.fullPath === state.interactionStore.selectedFile).length) {
                            newSelectedPath = null;
                        }
                    }
                    const wsStore = events_version_control_1.versionControlReducer(state.wsStore, event);
                    if (state.interactionStore.selectedFile !== newSelectedPath) {
                        const value = wsStore.files[newSelectedPath];
                        interactionStore = interaction_store_1.interactionReducer(state.interactionStore, {
                            type: "selectedView",
                            fullPath: value === null || value === void 0 ? void 0 : value.fullPath,
                            readOnly: value && events_version_control_1.isReadonly(value.history, value.revision),
                            text: value === null || value === void 0 ? void 0 : value.text,
                            comments: value === null || value === void 0 ? void 0 : value.commentStore,
                            revision: value === null || value === void 0 ? void 0 : value.revision,
                        });
                    }
                    //should handle whne you commit
                    // should handle when viewing a deleted script
                    // should disable buttons for rename and delete when you edit.
                    return {
                        ...state,
                        wsStore,
                        interactionStore,
                    };
            }
    }
    return state;
};
exports.appReducer = appReducer;
//# sourceMappingURL=store.js.map