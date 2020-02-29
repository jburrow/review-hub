import { initialVersionControlState } from "./events-version-control";

import { appReducer, VersionControlStoreType } from "./store";

test("reduceVersionControl: edit=>edit=>edit", () => {
  let store = appReducer(
    {
      interactionStore: {},
      vcStore: initialVersionControlState(),
      wsStore: initialVersionControlState()
    },
    {
      type: "commit",
      storeType: VersionControlStoreType.VersionControl,
      author: "a1",
      events: [{ type: "edit", fullPath: "/script1.py", text: "t1" }]
    }
  );
  console.log("hello");

  // expect(store.files["/script1.py"].text).toBe("t1");

  // actions = [
  //   {
  //     type: "commit",
  //     author: "author.one",
  //     events: [{ type: "edit", fullPath: "/script1.py", text: "t2" }]
  //   }
  // ];
  // store = reduceVersionControl(actions, store);
  // expect(store.files["/script1.py"].text).toBe("t2");

  // actions = [
  //   {
  //     type: "commit",
  //     author: "author.one",
  //     events: [{ type: "edit", fullPath: "/script1.py", text: "t3" }]
  //   }
  // ];
  // store = reduceVersionControl(actions, store);
  // expect(store.files["/script1.py"].text).toBe("t3");
  // expect(store.files["/script1.py"].history.length).toBe(3);
});
