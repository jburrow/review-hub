"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFakeMainStore = exports.demoStore = void 0;
const events_version_control_1 = require("./events-version-control");
const loadVersionControlStore = () => {
    const events = [
        {
            fullPath: "/script1.txt",
            text: "function version(){ return 's1.1'}",
            type: "edit",
            revision: 0,
        },
        {
            fullPath: "/script3.py",
            text: "function version(){ return 's3.1'}",
            type: "edit",
            revision: 0,
        },
    ];
    const store = events_version_control_1.reduceVersionControl([
        {
            type: "commit",
            author: "james",
            id: "id-0",
            events: events,
        },
        {
            type: "commit",
            author: "james",
            id: "id-1",
            events: [
                {
                    fullPath: "/script1.txt",
                    text: "function version(){ return 's1.2'}",
                    type: "edit",
                    revision: 0,
                },
                {
                    fullPath: "/script2.py",
                    text: "function version(){ return 's2.1'}",
                    type: "edit",
                    revision: 0,
                },
            ],
        },
        {
            type: "commit",
            author: "james",
            id: "id-2",
            events: [
                {
                    fullPath: "/script1.txt",
                    text: "function version(){ return 's1.3'}",
                    type: "edit",
                    revision: 0,
                },
            ],
        },
        {
            type: "commit",
            author: "james",
            id: "id-4",
            events: [
                {
                    fullPath: "/script1.txt",
                    commentEvents: [
                        {
                            lineNumber: 1,
                            text: "",
                            type: "create",
                            createdAt: 0,
                            createdBy: "xxx",
                            id: "1",
                        },
                    ],
                    revision: 0,
                    type: "comment",
                },
            ],
        },
    ]);
    return store;
};
exports.demoStore = {
    load: async () => {
        return new Promise((resolve) => {
            const v = window.localStorage.getItem("demo-persist") || "null";
            const events = JSON.parse(v);
            if (events) {
                resolve(events_version_control_1.reduceVersionControl(events));
            }
            else {
                resolve(loadVersionControlStore());
            }
        });
    },
    save: async (store) => {
        return new Promise((resolve) => {
            window.localStorage.setItem("demo-persist", JSON.stringify(store.events));
            resolve(true);
        });
    },
};
function createFakeMainStore(files) {
    return events_version_control_1.versionControlReducer(events_version_control_1.initialVersionControlState(), {
        type: "commit",
        author: "?",
        events: Object.entries(files)
            .filter(([fn, fs]) => fs.status === events_version_control_1.FileStateStatus.active)
            .map(([fn, _]) => ({
            type: "edit",
            fullPath: fn,
            revision: 1,
            text: `i am main branch ${new Date().toISOString()}`,
        })),
    });
}
exports.createFakeMainStore = createFakeMainStore;
//# sourceMappingURL=demo-store.js.map