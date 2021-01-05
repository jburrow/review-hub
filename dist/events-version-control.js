"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReadonly = exports.reduceVersionControl = exports.versionControlReducer = exports.initialVersionControlState = exports.FileStateStatus = void 0;
const monaco_review_1 = require("monaco-review");
const uuid_1 = require("uuid");
var FileStateStatus;
(function (FileStateStatus) {
    FileStateStatus[FileStateStatus["active"] = 1] = "active";
    FileStateStatus[FileStateStatus["deleted"] = 2] = "deleted";
})(FileStateStatus = exports.FileStateStatus || (exports.FileStateStatus = {}));
function createFileState(event, fullPath, text, prev, status, commentStore) {
    const current = {
        fullPath: fullPath,
        status: status,
        text: text,
        revision: prev.revision + 1,
        commentStore: commentStore || { comments: {} },
    };
    return {
        ...current,
        history: [...prev.history, { event: event, fileState: current }],
    };
}
function initialVersionControlState() {
    return {
        files: {},
        version: -1,
        events: [],
        commits: {},
        headCommitId: null,
        commentStore: { comments: {} },
    };
}
exports.initialVersionControlState = initialVersionControlState;
function versionControlReducer(state, event) {
    switch (event.type) {
        case "reset":
            return initialVersionControlState();
        case "commit":
            const updates = {};
            let generalCommentStore = state.commentStore;
            for (const e of event.events) {
                if (e.type === "general-comment") {
                    generalCommentStore = monaco_review_1.reduceComments(e.commentEvents, generalCommentStore);
                    continue;
                }
                const prev = (state.files[e.fullPath] || {
                    fullPath: null,
                    text: null,
                    status: FileStateStatus.active,
                    history: [],
                    commentStore: { comments: {} },
                    revision: -1,
                });
                let status = FileStateStatus.active;
                let text = prev.text;
                let commentStore = prev.commentStore;
                switch (e.type) {
                    case "comment":
                        commentStore = monaco_review_1.reduceComments(e.commentEvents, commentStore);
                        console.info("commentStore after reduce", commentStore);
                        break;
                    case "edit":
                        status = FileStateStatus.active;
                        text = e.text;
                        break;
                    case "delete":
                        status = FileStateStatus.deleted;
                        text = null;
                        break;
                    case "rename":
                        status = FileStateStatus.active;
                        text = e.text || prev.text;
                        updates[e.oldFullPath] = createFileState(event, e.oldFullPath, "", prev, FileStateStatus.deleted, commentStore);
                        break;
                    default:
                        throw `unknown type`;
                }
                updates[e.fullPath] = createFileState(event, e.fullPath, text, prev, status, commentStore);
            }
            const files = {
                ...state.files,
                ...updates,
            };
            const commitId = event.id || uuid_1.v4();
            const newCommit = {};
            newCommit[commitId] = files;
            return {
                files: files,
                commits: { ...state.commits, ...newCommit },
                events: [...state.events, event],
                version: state.version + 1,
                headCommitId: event.id,
                commentStore: generalCommentStore,
            };
    }
}
exports.versionControlReducer = versionControlReducer;
function reduceVersionControl(actions, state = null) {
    state = state || initialVersionControlState();
    for (const a of actions) {
        state = versionControlReducer(state, a);
    }
    return state;
}
exports.reduceVersionControl = reduceVersionControl;
function isReadonly(history, revision) {
    return history[history.length - 1].fileState.revision !== revision;
}
exports.isReadonly = isReadonly;
//# sourceMappingURL=events-version-control.js.map