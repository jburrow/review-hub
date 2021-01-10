import { interactionReducer } from "./interaction-store";

test("interaction-store: selectedCommitId", () => {
  const store = interactionReducer({ currentUser: "" }, { type: "selectCommit", commitId: "cid" });

  expect(store.selectedCommitId).toBe("cid");
});

test("interaction-store: selectedView", () => {
  const selectedView = {
    readOnly: false,
    label: "",
    fullPath: "",
    revision: 0,
    text: "",
  };
  const store = interactionReducer({ currentUser: "" }, { type: "selectedView", ...selectedView });

  expect(store.selectedView).toEqual(selectedView);
});
