import { FileStateStatus } from "./events-version-control";
import { rebaseScripts } from "./import-export";

test("rebaseScripts - noop", () => {
  const event = rebaseScripts("author", {}, {});
  expect(event.events.length).toBe(0);
});

test("rebaseScripts - 1 delete & 1 update", () => {
  const event = rebaseScripts(
    "author",
    {
      "existing.py": {
        text: "",
        history: [],
        commentStore: null,
        fullPath: "",
        revision: 1,
        status: FileStateStatus.active,
      },
    },
    {
      "new.py": {
        text: "its new!",
        history: [],
        commentStore: null,
        fullPath: "",
        revision: 1,
        status: FileStateStatus.active,
      },
    }
  );

  expect(event.events).toEqual([
    { type: "edit", fullPath: "new.py", text: "its new!" },
    { type: "delete", fullPath: "existing.py" },
  ]);
});
