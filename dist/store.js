"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appReducer = exports.initialState = exports.VersionControlStoreType = void 0;
const events_version_control_1 = require("./events-version-control");
const interaction_store_1 = require("./interaction-store");
var VersionControlStoreType;
(function (VersionControlStoreType) {
    VersionControlStoreType[VersionControlStoreType["Working"] = 0] = "Working";
    VersionControlStoreType[VersionControlStoreType["VersionControl"] = 1] = "VersionControl";
    VersionControlStoreType[VersionControlStoreType["Main"] = 2] = "Main";
})(VersionControlStoreType = exports.VersionControlStoreType || (exports.VersionControlStoreType = {}));
exports.initialState = {
    interactionStore: { currentUser: "xyz-user" },
    wsStore: events_version_control_1.initialVersionControlState(),
    vcStore: events_version_control_1.initialVersionControlState(),
    isHeadCommit: false,
};
const appReducer = (state, event) => {
    var _a, _b, _c, _d, _e, _f, _g;
    console.debug("appReducer:", event);
    switch (event.type) {
        case "selectCommit":
        case "selectedView":
        case "setCurrentUser":
            const interactionStore = interaction_store_1.interactionReducer(state.interactionStore, event);
            return {
                ...state,
                interactionStore,
                isHeadCommit: interactionStore.selectedCommitId && state.vcStore.headCommitId != interactionStore.selectedCommitId,
            };
        case "load":
            return {
                ...state,
                vcStore: (_a = event.vcStore) !== null && _a !== void 0 ? _a : state.vcStore,
                mainStore: (_b = event.mainStore) !== null && _b !== void 0 ? _b : state.mainStore,
                wsStore: events_version_control_1.initialVersionControlState(),
            };
        case "commit":
        case "reset":
            switch (event.storeType) {
                case VersionControlStoreType.VersionControl:
                    const isHeadCommit = state.interactionStore.selectedCommitId && state.vcStore.headCommitId ? true : false;
                    let s2 = exports.appReducer({
                        ...state,
                        vcStore: events_version_control_1.versionControlReducer(state.vcStore, event),
                        isHeadCommit,
                    }, {
                        type: "reset",
                        storeType: VersionControlStoreType.Working,
                    });
                    if (isHeadCommit) {
                        s2 = exports.appReducer(s2, {
                            type: "selectCommit",
                            commitId: null,
                        });
                    }
                    return s2;
                case VersionControlStoreType.Working:
                    let newSelectedPath = (_c = state.interactionStore.selectedView) === null || _c === void 0 ? void 0 : _c.fullPath;
                    let interactionStore = state.interactionStore;
                    console.log(newSelectedPath);
                    // if we are renaming of a revision ::  and it isn't in the working set... then do we need to seed it?
                    if (event.type === "commit") {
                        const rename = event.events.filter((e) => e.type === "rename" && e.oldFullPath === newSelectedPath);
                        if (rename.length > 0 && rename[0].type == "rename") {
                            newSelectedPath = rename[0].fullPath;
                        }
                        if (event.events.filter((e) => e.type === "delete" && e.fullPath === newSelectedPath).length) {
                            newSelectedPath = null;
                        }
                    }
                    const wsStore = events_version_control_1.versionControlReducer(state.wsStore, event);
                    if (((_e = (_d = state.interactionStore) === null || _d === void 0 ? void 0 : _d.selectedView) === null || _e === void 0 ? void 0 : _e.fullPath) === newSelectedPath &&
                        !((_g = (_f = state.interactionStore) === null || _f === void 0 ? void 0 : _f.selectedView) === null || _g === void 0 ? void 0 : _g.readOnly)) {
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