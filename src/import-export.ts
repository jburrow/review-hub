import * as JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  VersionControlState,
  FileStateStatus,
  FileState,
} from "./events-version-control";

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
