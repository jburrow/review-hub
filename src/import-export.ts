import * as JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  FileStateStatus,
  FileState,
  FileDeleteEvent,
  FileEditEvent,
  FileEvents,
} from "./events-version-control";
import { AppCommitEvent, VersionControlStoreType } from "./store";

export async function generateZip(files: Record<string, FileState>) {
  var zip = new JSZip();
  for (const [name, content] of Object.entries(files)) {
    if (content.status === FileStateStatus.active) {
      zip.file(name, content.text);
    }
  }
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "example.zip");
}

export function rebaseScripts(
  currentFiles: Record<string, FileState>,
  files: Record<string, FileState>
): AppCommitEvent {
  const deleteEvents: FileEvents[] = Object.keys(currentFiles)
    .filter((f) => files[f] === undefined)
    .map((fullPath) => {
      return {
        type: "delete",
        fullPath,
      } as FileDeleteEvent;
    });
  const editEvents: FileEvents[] = Object.entries(files)
    .filter(([fullPath, v]) => {
      currentFiles[fullPath].text !== v.text;
    })
    .map(([fullPath, v]) => {
      return { type: "edit", fullPath, text: v.text } as FileEditEvent;
    });

  return {
    type: "commit",
    author: "",
    storeType: VersionControlStoreType.VersionControl,
    events: editEvents.concat(deleteEvents),
  };
}
