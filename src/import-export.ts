// import * as JSZip from "jszip";
// import { saveAs } from "file-saver";
import { VersionControlState, FileStateStatus } from "./events-version-control";

export async function generateZip(store: VersionControlState) {
  // var zip = new JSZip();

  // for (const [name, content] of Object.entries(store.files)) {
  //   if (content.status === FileStateStatus.active) {
  //     zip.file(name, content.text);
  //   }
  // }

  // const content = await zip.generateAsync({ type: "blob" });
  // saveAs(content, "example.zip");
}
