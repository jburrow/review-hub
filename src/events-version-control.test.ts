/**
 * @jest-environment jsdom
 */

import { reduceVersionControl, VersionControlEvent, FileStateStatus, FileEvents } from "./events-version-control";

test("reduceVersionControl: edit=>edit=>edit", () => {
  let actions: VersionControlEvent[] = [
    {
      type: "commit",
      author: "author.one",
      events: [{ type: "edit", fullPath: "/script1.py", revision: 1, text: "t1" }],
    },
  ];
  let store = reduceVersionControl(actions);
  expect(store.files["/script1.py"].text).toBe("t1");

  actions = [
    {
      type: "commit",
      author: "author.one",
      events: [{ type: "edit", fullPath: "/script1.py", revision: 1, text: "t2" }],
    },
  ];
  store = reduceVersionControl(actions, store);
  expect(store.files["/script1.py"].text).toBe("t2");

  actions = [
    {
      type: "commit",
      author: "author.one",
      events: [{ type: "edit", fullPath: "/script1.py", text: "t3", revision: 1 }],
    },
  ];
  store = reduceVersionControl(actions, store);
  expect(store.files["/script1.py"].text).toBe("t3");
  expect(store.files["/script1.py"].history.length).toBe(3);
});

test("reduceVersionControl: edit=>delete=>edit", () => {
  let actions: VersionControlEvent[] = [
    {
      type: "commit",
      author: "author.one",
      events: [{ type: "edit", fullPath: "/script1.py", text: "t1", revision: 1 }],
    },
  ];
  let store = reduceVersionControl(actions);
  expect(store.files["/script1.py"].text).toBe("t1");

  actions = [
    {
      type: "commit",
      author: "author.one",
      events: [{ type: "delete", fullPath: "/script1.py", revision: 1 }],
    },
  ];
  store = reduceVersionControl(actions, store);
  expect(store.files["/script1.py"].text).toBe(null);
  expect(store.files["/script1.py"].status).toBe(FileStateStatus.deleted);
  expect(store.files["/script1.py"].history.length).toBe(2);

  actions = [
    {
      type: "commit",
      author: "author.one",
      events: [{ type: "edit", fullPath: "/script1.py", text: "t1", revision: 1 }],
    },
  ];
  store = reduceVersionControl(actions, store);
  expect(store.files["/script1.py"].text).toBe("t1");
  expect(store.files["/script1.py"].status).toBe(FileStateStatus.active);
});

test("reduceVersionControl: reset=>edit=>comment=>comment", () => {
  let actions: VersionControlEvent[] = [
    { type: "reset" },
    {
      type: "commit",
      author: "author.one",
      events: [{ type: "edit", fullPath: "/script1.py", text: "t1", revision: 1 }],
    },
    {
      type: "commit",
      author: "author.one",
      events: [
        {
          type: "comment",
          fullPath: "/script1.py",
          revision: 1,
          commentEvents: [
            {
              lineNumber: 1,
              text: "2",
              type: "create",
              createdBy: "author.comment",
            },
          ],
        },
      ],
    },
    {
      type: "commit",
      author: "author.one",
      events: [
        {
          type: "comment",
          fullPath: "/script1.py",
          revision: 1,
          commentEvents: [
            {
              lineNumber: 2,
              text: "2",
              type: "create",
              createdBy: "author.comment",
            },
          ],
        },
      ],
    },
  ];
  let store = reduceVersionControl(actions);
  expect(store.files["/script1.py"].text).toBe("t1");
  for (const h of store.files["/script1.py"].history) {
    //console.debug('history')
    // for (const c of Object.values(h.fileState.commentStore.comments)) {
    //   //console.debug(`\t${c.comment.lineNumber} - ${c.comment.text}`)
    // }
  }
});

test("reduceVersionControl: commit=>commit=>commit=>commit - check revisions", () => {
  const events: FileEvents[] = [
    {
      fullPath: "/script1.py",
      revision: 1,
      text: "function version(){ return 's1.1'}",
      type: "edit",
    },
    {
      fullPath: "/script2.py",
      revision: 1,
      text: "function version(){ return 's2.1'}",
      type: "edit",
    },
    {
      fullPath: "/script3.py",
      revision: 1,
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
          revision: 1,
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
          revision: 1,
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
          revision: 1,
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
          type: "comment",
        },
      ],
    },
  ]);

  expect(Object.keys(store.files["/script1.py"].history).length).toBe(4);
  // expect(
  //   store.files["/script1.py"].history.map((h) => h.fileState.revision)
  // ).toEqual([0, 1, 2, 3]);
  expect(Object.keys(store.commits)).toEqual(["id-0", "id-1", "id-2", "id-4"]);
});
