import {
  FileEvents,
  FileRenameEvent,
  initialVersionControlState,
} from "./events-version-control";

import { appReducer, VersionControlStoreType } from "./store";

test("reduceVersionControl: edit=>edit=>edit", () => {
  let store = appReducer(
    {
      interactionStore: { currentUser: "unit-test" },
      vcStore: initialVersionControlState(),
      wsStore: initialVersionControlState(),
    },
    {
      type: "commit",
      storeType: VersionControlStoreType.VersionControl,
      author: "a1",
      events: [{ type: "edit", fullPath: "/script1.py", text: "t1" }],
    }
  );

  expect(store.vcStore.files["/script1.py"].revision).toBe(0);

  let s1 = appReducer(store, {
    type: "selectedView",
    fullPath: "/script1.py",
    revision: store.vcStore.files["/script1.py"].revision,
    readOnly: false,
    text: "",
  });

  let s2 = appReducer(s1, {
    type: "commit",
    storeType: VersionControlStoreType.VersionControl,
    author: "a1",
    events: [{ type: "edit", fullPath: "/script1.py", text: "t2" }],
  });

  expect(s2.interactionStore.selectedView.text).toBe("t2");
  expect(s2.interactionStore.selectedView.revision).toBe(
    s2.vcStore.files["/script1.py"].revision
  );

  let s3 = appReducer(s2, {
    type: "commit",
    storeType: VersionControlStoreType.Working,
    author: "a1",
    events: [
      {
        type: "rename",
        fullPath: "/script1_new_name.py",
        oldFullPath: "/script1.py",
      } as FileRenameEvent,
    ],
  });

  expect(s3.interactionStore.selectedFile).toBe("/script1_new_name.py");
  expect(s3.interactionStore.selectedView.fullPath).toBe(
    "/script1_new_name.py"
  );

  console.log(s3.interactionStore.selectedView);
});
