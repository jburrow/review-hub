"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateZip = void 0;
const JSZip = require("jszip");
const file_saver_1 = require("file-saver");
const events_version_control_1 = require("./events-version-control");
async function generateZip(files) {
    var zip = new JSZip();
    for (const [name, content] of Object.entries(files)) {
        if (content.status === events_version_control_1.FileStateStatus.active) {
            zip.file(name, content.text);
        }
    }
    const content = await zip.generateAsync({ type: "blob" });
    file_saver_1.saveAs(content, "example.zip");
}
exports.generateZip = generateZip;
//# sourceMappingURL=import-export.js.map