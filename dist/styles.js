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
        // backgroundColor: "#224D2533"
    },
    version_control: {
        ...common,
        // backgroundColor: "#D28C1F33"
    },
    editor: {
        ...common,
        // backgroundColor: "#561E8E33",
    },
    script_history: {
        ...common,
        // backgroundColor: "#1E518933",
    },
    vc_history: {
        ...common,
        // backgroundColor: "#684D2533",
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