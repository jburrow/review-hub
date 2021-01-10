import { Button, DialogActions, DialogContent, TextField, withStyles, WithStyles } from "@material-ui/core";
import * as React from "react";
import { AppStyles } from "../styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

export const RenameDialog = withStyles(AppStyles)(
  (
    props: {
      open: boolean;
      onClose({ newFullPath: string, rename: boolean }): void;
      fullPath: string;
    } & WithStyles<typeof AppStyles>
  ) => {
    const [newFullPath, setNewFullPath] = React.useState<string>(props.fullPath);
    return (
      <Dialog
        onClose={(e) => {
          props.onClose({ newFullPath, rename: true });
        }}
        aria-labelledby="simple-dialog-title"
        open={props.open}
      >
        <DialogTitle id="simple-dialog-title">Rename File</DialogTitle>
        <DialogContent>
          <TextField
            onChange={(e) => {
              setNewFullPath(e.target.value);
            }}
            value={newFullPath}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.onClose({ newFullPath, rename: false })} variant="contained">
            Cancel
          </Button>
          <Button
            onClick={() => props.onClose({ newFullPath, rename: true })}
            disabled={newFullPath == props.fullPath}
            variant="contained"
            color="primary"
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);
