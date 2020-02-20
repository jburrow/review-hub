import {
  reduceVersionControl,
  VersionControlEvent,
  FileStateStatus
} from "./events-version-control";
test("reduceVersionControl: edit=>edit=>edit", () => {
  let actions: VersionControlEvent[] = [
    {
      type: "commit",
      author: "author.one",
      events: [{ type: "edit", fullPath: "/script1.py", text: "t1" }]
    }
  ];
  let store = reduceVersionControl(actions);
  expect(store.files["/script1.py"].text).toBe("t1");

  actions = [
    {
      type: "commit",
      author: "author.one",
      events: [{ type: "edit", fullPath: "/script1.py", text: "t2" }]
    }
  ];
  store = reduceVersionControl(actions, store);
  expect(store.files["/script1.py"].text).toBe("t2");

  actions = [
    {
      type: "commit",
      author: "author.one",
      events: [{ type: "edit", fullPath: "/script1.py", text: "t3" }]
    }
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
      events: [{ type: "edit", fullPath: "/script1.py", text: "t1" }]
    }
  ];
  let store = reduceVersionControl(actions);
  expect(store.files["/script1.py"].text).toBe("t1");

  actions = [
    {
      type: "commit",
      author: "author.one",
      events: [{ type: "delete", fullPath: "/script1.py" }]
    }
  ];
  store = reduceVersionControl(actions, store);
  expect(store.files["/script1.py"].text).toBe(null);
  expect(store.files["/script1.py"].status).toBe(FileStateStatus.deleted);
  expect(store.files["/script1.py"].history.length).toBe(2);

  actions = [
    {
      type: "commit",
      author: "author.one",
      events: [{ type: "edit", fullPath: "/script1.py", text: "t1" }]
    }
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
      events: [{ type: "edit", fullPath: "/script1.py", text: "t1" }]
    },
    {
      type: "commit",
      author: "author.one",
      events: [{
        type: "comment",
        fullPath: "/script1.py",
        commentEvents: [{ lineNumber: 1, text: '2', type: 'create', createdBy: 'author.comment' }]
      }]
    },
    {
      type: "commit",
      author: "author.one",
      events: [{
        type: "comment",
        fullPath: "/script1.py",
        commentEvents: [{ lineNumber: 2, text: '2', type: 'create', createdBy: 'author.comment' }]
      }]
    }
  ];
  let store = reduceVersionControl(actions);
  expect(store.files["/script1.py"].text).toBe("t1");
  for (const h of store.files["/script1.py"].history) {
    console.debug('history')
    // for (const c of Object.values(h.fileState.commentStore.comments)) {
    //   //console.debug(`\t${c.comment.lineNumber} - ${c.comment.text}`)
    // }

  }

})