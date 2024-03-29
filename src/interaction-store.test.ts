/**
 * @jest-environment jsdom
 */

import { interactionReducer, SelectedSimpleView } from "./interaction-store";
import { VersionControlStoreType } from "./store";

test("interaction-store: selectedCommitId", () => {
  const store = interactionReducer({ currentUser: "" }, { type: "selectCommit", commitId: "cid" });

  expect(store.selectedCommitId).toBe("cid");
});

test("interaction-store: selectedView", () => {
  const selectedView: SelectedSimpleView = {
    type: "view",
    readOnly: false,
    label: "",
    fullPath: "",
    revision: null,
    text: "",
    storeType: VersionControlStoreType.Working,
  };
  const store = interactionReducer({ currentUser: "" }, { type: "selectedView", selectedView });

  expect(store.selectedView).toEqual(selectedView);
});
