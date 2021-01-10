"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rebaseScripts = exports.generateZip = void 0;
const JSZip = require("jszip");
const file_saver_1 = require("file-saver");
const events_version_control_1 = require("./events-version-control");
const store_1 = require("./store");
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
function rebaseScripts(author, currentFiles, files) {
    const deleteEvents = Object.keys(currentFiles)
        .filter((f) => files[f] === undefined)
        .map((fullPath) => {
        return {
            type: "delete",
            fullPath,
        };
    });
    const editEvents = Object.entries(files)
        .filter(([fullPath, v]) => {
        return currentFiles[fullPath] == undefined || currentFiles[fullPath].text !== v.text;
    })
        .map(([fullPath, v]) => {
        return { type: "edit", fullPath, text: v.text };
    });
    return {
        type: "commit",
        author: author,
        storeType: store_1.VersionControlStoreType.Branch,
        events: editEvents.concat(deleteEvents),
    };
}
exports.rebaseScripts = rebaseScripts;
//# sourceMappingURL=import-export.js.map