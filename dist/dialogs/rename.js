"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenameDialog = void 0;
const core_1 = require("@material-ui/core");
const React = require("react");
const styles_1 = require("../styles");
const DialogTitle_1 = require("@material-ui/core/DialogTitle");
const Dialog_1 = require("@material-ui/core/Dialog");
exports.RenameDialog = core_1.withStyles(styles_1.AppStyles)((props) => {
    const [newFullPath, setNewFullPath] = React.useState(props.fullPath);
    return (React.createElement(Dialog_1.default, { onClose: (e) => {
            props.onClose({ newFullPath, rename: true });
        }, "aria-labelledby": "simple-dialog-title", open: props.open },
        React.createElement(DialogTitle_1.default, { id: "simple-dialog-title" }, "Rename File"),
        React.createElement(core_1.DialogContent, null,
            React.createElement(core_1.TextField, { onChange: (e) => {
                    setNewFullPath(e.target.value);
                }, value: newFullPath })),
        React.createElement(core_1.DialogActions, null,
            React.createElement(core_1.Button, { onClick: () => props.onClose({ newFullPath, rename: false }), variant: "contained" }, "Cancel"),
            React.createElement(core_1.Button, { onClick: () => props.onClose({ newFullPath, rename: true }), disabled: newFullPath == props.fullPath, variant: "contained", color: "primary" }, "Rename"))));
});
//# sourceMappingURL=rename.js.map