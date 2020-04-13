import {
  VersionControlState,
  FileEvents,
  reduceVersionControl,
} from "./events-version-control";

function loadVersionControlStore(): VersionControlState {
  const events: FileEvents[] = [
    {
      fullPath: "/script1.py",
      text: "function version(){ return 's1.1'}",
      type: "edit",
    },

    {
      fullPath: "/script3.py",
      text: "function version(){ return 's3.1'}",
      type: "edit",
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
          fullPath: "/script1.py",
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
          fullPath: "/script1.py",
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
          fullPath: "/script1.py",
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
}

export const demoStore = {
  load: loadVersionControlStore,
  save: (store) => null,
};
