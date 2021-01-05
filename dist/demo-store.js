"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.demoStore = void 0;
const events_version_control_1 = require("./events-version-control");
const loadVersionControlStore = () => {
    const events = [
        {
            fullPath: "/script1.txt",
            text: "function version(){ return 's1.1'}",
            type: "edit",
        },
        {
            fullPath: "/script3.py",
            text: "function version(){ return 's3.1'}",
            type: "edit",
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
                },
                {
                    fullPath: "/script2.py",
                    text: "function version(){ return 's2.1'}",
                    type: "edit",
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
                            createdAt: "",
                            createdBy: "xxx",
                            id: "1",
                        },
                    ],
                    type: "comment",
                },
            ],
        },
    ]);
    return store;
};
exports.demoStore = {
    load: () => {
        const v = window.localStorage.getItem("demo-persist") || "null";
        const events = JSON.parse(v);
        if (events) {
            return events_version_control_1.reduceVersionControl(events);
        }
        else {
            return loadVersionControlStore();
        }
    },
    save: (store) => {
        window.localStorage.setItem("demo-persist", JSON.stringify(store.events));
    },
};
//# sourceMappingURL=demo-store.js.map