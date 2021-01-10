"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshSelectedView = exports.getFile = exports.appReducer = exports.initialState = exports.versionControlStoreTypeLabel = exports.VersionControlStoreType = void 0;
const events_version_control_1 = require("./events-version-control");
const interaction_store_1 = require("./interaction-store");
var VersionControlStoreType;
(function (VersionControlStoreType) {
    VersionControlStoreType[VersionControlStoreType["Working"] = 0] = "Working";
    VersionControlStoreType[VersionControlStoreType["Branch"] = 1] = "Branch";
    VersionControlStoreType[VersionControlStoreType["Main"] = 2] = "Main";
})(VersionControlStoreType = exports.VersionControlStoreType || (exports.VersionControlStoreType = {}));
function versionControlStoreTypeLabel(v) {
    switch (v) {
        case VersionControlStoreType.Branch:
            return "branch";
        case VersionControlStoreType.Main:
            return "main";
        case VersionControlStoreType.Working:
            return "working";
    }
}
exports.versionControlStoreTypeLabel = versionControlStoreTypeLabel;
exports.initialState = {
    interactionStore: { currentUser: "xyz-user" },
    wsStore: events_version_control_1.initialVersionControlState(),
    vcStore: events_version_control_1.initialVersionControlState(),
    isHeadCommit: false,
};
const appReducer = (state, event) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    console.debug("appReducer:", event);
    switch (event.type) {
        case "selectCommit":
        case "selectedView":
        case "setCurrentUser":
            const is1 = interaction_store_1.interactionReducer(state.interactionStore, event);
            return {
                ...state,
                interactionStore: is1,
                isHeadCommit: is1.selectedCommitId && state.vcStore.headCommitId != is1.selectedCommitId,
            };
        case "load":
            //TODO - anywhere that is calling the interaction reducer and not passing selectedView back to appReducer is wrong.
            const s1 = {
                ...state,
                vcStore: (_a = event.vcStore) !== null && _a !== void 0 ? _a : state.vcStore,
                mainStore: (_b = event.mainStore) !== null && _b !== void 0 ? _b : state.mainStore,
                wsStore: events_version_control_1.initialVersionControlState(),
            };
            const is2 = ((_c = state.interactionStore) === null || _c === void 0 ? void 0 : _c.selectedView) ? refreshSelectedView(s1, (_d = state.interactionStore) === null || _d === void 0 ? void 0 : _d.selectedView.fullPath)
                : s1.interactionStore;
            return { ...s1, interactionStore: is2 };
        case "commit":
        case "reset":
            switch (event.storeType) {
                case VersionControlStoreType.Branch:
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
                    let newSelectedPath = (_e = state.interactionStore.selectedView) === null || _e === void 0 ? void 0 : _e.fullPath;
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
                    const s1 = {
                        ...state,
                        wsStore,
                    };
                    const interactionStore = ((_f = state.interactionStore) === null || _f === void 0 ? void 0 : _f.selectedView) &&
                        ((_g = state.interactionStore) === null || _g === void 0 ? void 0 : _g.selectedView.fullPath) === newSelectedPath &&
                        !((_h = state.interactionStore) === null || _h === void 0 ? void 0 : _h.selectedView.readOnly)
                        ? refreshSelectedView(s1, newSelectedPath)
                        : state.interactionStore;
                    //should handle whne you commit
                    // should handle when viewing a deleted script
                    // should disable buttons for rename and delete when you edit.
                    return {
                        ...s1,
                        interactionStore,
                    };
            }
    }
    return state;
};
exports.appReducer = appReducer;
function getFile(store, storeType, fullPath) {
    var _a, _b, _c, _d;
    switch (storeType) {
        case VersionControlStoreType.Main:
            return (_a = store.mainStore) === null || _a === void 0 ? void 0 : _a.files[fullPath];
        case VersionControlStoreType.Working:
            return ((_b = store.wsStore) === null || _b === void 0 ? void 0 : _b.files[fullPath]) || ((_c = store.vcStore) === null || _c === void 0 ? void 0 : _c.files[fullPath]);
        case VersionControlStoreType.Branch:
            return (_d = store.vcStore) === null || _d === void 0 ? void 0 : _d.files[fullPath];
    }
}
exports.getFile = getFile;
function refreshSelectedView(state, newSelectedPath) {
    const value = getFile(state, state.interactionStore.selectedView.storeType, newSelectedPath);
    let selectedView = null;
    if (value) {
        selectedView = {
            ...state.interactionStore.selectedView,
            fullPath: value.fullPath,
            readOnly: value && events_version_control_1.isReadonly(value.history, value.revision),
            text: value.text,
            comments: value.commentStore,
            revision: value.revision,
        };
    }
    if (selectedView && selectedView.type == "diff") {
        const original = getFile(state, selectedView.originalStoreType, newSelectedPath);
        selectedView = {
            ...selectedView,
            original: original.text,
            originalRevision: original.revision,
        };
    }
    return interaction_store_1.interactionReducer(state.interactionStore, {
        type: "selectedView",
        selectedView,
    });
}
exports.refreshSelectedView = refreshSelectedView;
//# sourceMappingURL=store.js.map