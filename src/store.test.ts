import { FileDeleteEvent, FileEditEvent, FileRenameEvent, initialVersionControlState } from "./events-version-control";

import { appReducer, VersionControlStoreType } from "./store";

test("reduceVersionControl: edit=>edit=>edit", () => {
  const store = appReducer(
    {
      interactionStore: { currentUser: "unit-test" },
      vcStore: initialVersionControlState(),
      wsStore: initialVersionControlState(),
      isHeadCommit: false,
    },
    {
      type: "commit",
      storeType: VersionControlStoreType.Branch,
      author: "a1",
      events: [
        {
          type: "edit",
          fullPath: "/script1.py",
          text: "t1",
          revision: 1,
        } as FileEditEvent,
      ],
    }
  );

  expect(store.vcStore.files["/script1.py"].revision).toBe(2);

  const s1 = appReducer(store, {
    type: "selectedView",
    selectedView: {
      type: "view",
      storeType: VersionControlStoreType.Working,
      fullPath: "/script1.py",
      revision: store.vcStore.files["/script1.py"].revision,
      readOnly: false,
      text: "",
    },
  });

  const s2 = appReducer(s1, {
    type: "commit",
    storeType: VersionControlStoreType.Branch,
    author: "a1",
    events: [
      {
        type: "edit",
        fullPath: "/script1.py",
        text: "t2",
        revision: 2,
      } as FileEditEvent,
    ],
  });

  //expect(s2.interactionStore.selectedView).toBe(undefined);

  const s3 = appReducer(s2, {
    type: "commit",
    storeType: VersionControlStoreType.Working,
    author: "a1",
    events: [
      {
        type: "rename",
        fullPath: "/script1_new_name.py",
        oldFullPath: "/script1.py",
        revision: s2.vcStore.files["/script1.py"].revision,
      } as FileRenameEvent,
    ],
  });

  // expect(s3.interactionStore.selectedView.fullPath).toBe(
  //   "/script1_new_name.py"
  // );

  const s4 = appReducer(s3, {
    type: "commit",
    storeType: VersionControlStoreType.Working,
    author: "a1",
    events: [
      {
        type: "delete",
        fullPath: "/script1_new_name.py",
      } as FileDeleteEvent,
    ],
  });

  // expect(s4.interactionStore.selectedView.fullPath).toBe(undefined);
});
