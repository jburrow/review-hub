import { Persistence } from "./app";
import {
  VersionControlState,
  FileEvents,
  reduceVersionControl,
  versionControlReducer,
  initialVersionControlState,
  Files,
  FileStateStatus,
} from "./events-version-control";

const loadVersionControlStore = (): VersionControlState => {
  const events: FileEvents[] = [
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

  const store = reduceVersionControl([
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
              createdAt: "",
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

export const demoStore: Persistence = {
  load: async () => {
    return new Promise((resolve) => {
      const v = window.localStorage.getItem("demo-persist") || "null";
      const events = JSON.parse(v);

      if (events) {
        resolve(reduceVersionControl(events));
      } else {
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

export function createFakeMainStore(files: Files) {
  return versionControlReducer(initialVersionControlState(), {
    type: "commit",
    author: "?",
    events: Object.entries(files)
      .filter(([fn, fs]) => fs.status === FileStateStatus.active)
      .map(([fn, _]) => ({
        type: "edit",
        fullPath: fn,
        revision: 1,
        text: `i am main branch ${new Date().toISOString()}`,
      })),
  });
}
