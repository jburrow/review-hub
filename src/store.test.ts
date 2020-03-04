import { initialVersionControlState } from "./events-version-control";

import { appReducer, VersionControlStoreType } from "./store";

test("reduceVersionControl: edit=>edit=>edit", () => {
  let store = appReducer(
    {
      interactionStore: { currentUser: "unit-test" },
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

  expect(store.vcStore.files["/script1.py"].revision).toBe(0);

  let s1 = appReducer(store, {
    type: "selectedView",
    fullPath: "/script1.py",
    revision: store.vcStore.files["/script1.py"].revision,
    readOnly: false,
    text: ""
  });

  let s2 = appReducer(s1, {
    type: "commit",
    storeType: VersionControlStoreType.VersionControl,
    author: "a1",
    events: [{ type: "edit", fullPath: "/script1.py", text: "t2" }]
  });

  expect(s2.interactionStore.selectedView.text).toBe("t2");
  expect(s2.interactionStore.selectedView.revision).toBe(
    s2.vcStore.files["/script1.py"].revision
  );
});
