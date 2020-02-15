"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_comments_reducers_1 = require("monaco-review/dist/events-comments-reducers");
var FileStateStatus;
(function (FileStateStatus) {
    FileStateStatus[FileStateStatus["active"] = 1] = "active";
    FileStateStatus[FileStateStatus["deleted"] = 2] = "deleted";
})(FileStateStatus = exports.FileStateStatus || (exports.FileStateStatus = {}));
function createFileState(event, fullPath, text, history, status, comments) {
    return {
        fullPath: fullPath,
        status: status,
        text: text,
        history: [...history, event],
        comments: comments || { comments: {} }
    };
}
function initialVersionControlState() {
    return { files: {}, version: -1, events: [] };
}
exports.initialVersionControlState = initialVersionControlState;
function versionControlReducer(state, event) {
    switch (event.type) {
        case "reset":
            return initialVersionControlState();
        case "commit":
            const updates = {};
            for (const e of event.events) {
                const prev = state.files[e.fullPath] || {
                    fullPath: null,
                    text: null,
                    status: FileStateStatus.active,
                    history: [],
                    comments: { viewZoneIdsToDelete: [], comments: {} }
                };
                let status = FileStateStatus.active;
                let text = prev.text;
                let comments = prev.comments;
                switch (e.type) {
                    case "comment":
                        comments = events_comments_reducers_1.reduceComments(e.commentEvents, comments);
                        console.info('comments', comments);
                        break;
                    case "edit":
                        text = e.text;
                        break;
                    case "delete":
                        status = FileStateStatus.deleted;
                        text = null;
                        break;
                    case "rename":
                        status = FileStateStatus.deleted;
                        updates[e.newFullPath] = createFileState(event, e.newFullPath, e.text || prev.text, prev.history, status, comments);
                        break;
                }
                updates[e.fullPath] = createFileState(event, e.fullPath, text, prev.history, status, comments);
            }
            return {
                files: Object.assign(Object.assign({}, state.files), updates),
                events: [...state.events, event],
                version: state.version + 1
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