"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmDialog = void 0;
const core_1 = require("@material-ui/core");
const React = require("react");
const styles_1 = require("../styles");
const DialogTitle_1 = require("@material-ui/core/DialogTitle");
const Dialog_1 = require("@material-ui/core/Dialog");
exports.ConfirmDialog = core_1.withStyles(styles_1.AppStyles)((props) => {
    return (React.createElement(Dialog_1.default, { onClose: (e) => {
            props.onClose(false);
        }, "aria-labelledby": "simple-dialog-title", open: props.open },
        React.createElement(DialogTitle_1.default, { id: "simple-dialog-title" }, props.title),
        React.createElement(core_1.DialogContent, null, props.message),
        React.createElement(core_1.DialogActions, null,
            React.createElement(core_1.Button, { onClick: () => props.onClose(false), variant: "contained" }, "Cancel"),
            React.createElement(core_1.Button, { onClick: () => props.onClose(true), variant: "contained", color: "primary" }, "Confirm"))));
});
//# sourceMappingURL=confirm.js.map