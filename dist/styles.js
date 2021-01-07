"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectedStyles = exports.AppStyles = void 0;
const core_1 = require("@material-ui/core");
const panelHeadingHeight = "20px";
const common = { backgroundColor: "#33333311" };
exports.AppStyles = core_1.createStyles({
    layout: {
        fontSize: "12px",
        backgroundColor: "#f9f4f633",
        overflow: "hidden",
    },
    header_bar: {
        ...common,
    },
    version_control: {
        ...common,
    },
    editor: {
        ...common,
    },
    script_history: {
        ...common,
    },
    vc_history: {
        ...common,
    },
    panel_content: {
        height: `calc(100% - ${panelHeadingHeight})`,
        overflow: "auto",
        padding: 5,
    },
    panel_heading: {
        height: panelHeadingHeight,
        backgroundColor: "#33333355",
        paddingBottom: 2,
        margin: 0,
        paddingLeft: 5,
        paddingTop: 2,
        cursor: "grab",
    },
});
exports.SelectedStyles = core_1.createStyles({
    selectedItem: { textDecoration: "underline", backgroundColor: "orange" },
    inactiveItem: {},
});
//# sourceMappingURL=styles.js.map