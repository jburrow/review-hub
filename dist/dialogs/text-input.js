"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextInputDialog = void 0;
const core_1 = require("@material-ui/core");
const React = require("react");
const styles_1 = require("../styles");
const DialogTitle_1 = require("@material-ui/core/DialogTitle");
const Dialog_1 = require("@material-ui/core/Dialog");
exports.TextInputDialog = core_1.withStyles(styles_1.AppStyles)((props) => {
    const [text, setText] = React.useState("");
    const onClose = (confirm) => {
        props.onClose({ text, confirm });
        setText("");
    };
    return (React.createElement(Dialog_1.default, { onClose: (e) => onClose(false), "aria-labelledby": "simple-dialog-title", open: props.open },
        React.createElement(DialogTitle_1.default, { id: "simple-dialog-title" }, props.title),
        React.createElement(core_1.DialogContent, null,
            React.createElement(core_1.TextField, { onChange: (e) => {
                    setText(e.target.value);
                }, value: text })),
        React.createElement(core_1.DialogActions, null,
            React.createElement(core_1.Button, { onClick: () => onClose(false), variant: "contained" }, "Cancel"),
            React.createElement(core_1.Button, { onClick: () => onClose(true), variant: "contained", color: "primary" }, "Ok"))));
});
//# sourceMappingURL=text-input.js.map