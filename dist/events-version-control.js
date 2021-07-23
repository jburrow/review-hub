"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceVersionControl = exports.versionControlReducer = exports.initialVersionControlState = exports.incrementRevision = exports.FileStateStatus = void 0;
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
        revision: incrementRevision(prev.revision),
        commentStore: commentStore || { comments: {} },
    };
    return {
        ...current,
        history: [...prev.history, { event: event, fileState: current }],
    };
}
function incrementRevision(revision) {
    //TODO - FIgure out how this should work.
    if (revision) {
        const rev = parseInt(revision, 10);
        return (rev + 1).toString();
    }
    else {
        return "1";
    }
}
exports.incrementRevision = incrementRevision;
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
    var _a;
    switch (event.type) {
        case "reset":
            return initialVersionControlState();
        case "commit":
            // Ensure all events have a timestamp
            const tmpEvent = {
                ...event,
                createdAt: event.createdAt && event.createdAt > 0 ? event.createdAt : new Date().getTime(),
            };
            const updates = {};
            let generalCommentStore = state.commentStore;
            for (const e of tmpEvent.events) {
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
                    revision: (_a = e.revision) !== null && _a !== void 0 ? _a : -1,
                });
                let status = FileStateStatus.active;
                let text = prev.text;
                let commentStore = prev.commentStore;
                switch (e.type) {
                    case "comment":
                        commentStore = monaco_review_1.reduceComments(e.commentEvents, commentStore);
                        console.debug("[commentStore] after reduce", commentStore);
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
                        updates[e.oldFullPath] = createFileState(tmpEvent, e.oldFullPath, "", prev, FileStateStatus.deleted, commentStore);
                        break;
                    default:
                        throw `unknown type`;
                }
                updates[e.fullPath] = createFileState(tmpEvent, e.fullPath, text, prev, status, commentStore);
            }
            const files = {
                ...state.files,
                ...updates,
            };
            const commitId = tmpEvent.id || uuid_1.v4();
            const newCommit = {};
            newCommit[commitId] = files;
            return {
                files: files,
                commits: { ...state.commits, ...newCommit },
                events: [...state.events, tmpEvent],
                version: state.version + 1,
                headCommitId: tmpEvent.id,
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
//# sourceMappingURL=events-version-control.js.map