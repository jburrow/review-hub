import {
  Button,
  DialogActions,
  DialogContent,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import * as React from "react";
import { AppStyles } from "../styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

export const ConfirmDialog = withStyles(AppStyles)(
  (
    props: {
      open: boolean;
      onClose(boolean): void;
      title: string;
      message: string;
    } & WithStyles<typeof AppStyles>
  ) => {
    return (
      <Dialog
        onClose={(e) => {
          props.onClose(false);
        }}
        aria-labelledby="simple-dialog-title"
        open={props.open}
      >
        <DialogTitle id="simple-dialog-title">{props.title}</DialogTitle>
        <DialogContent>{props.message}</DialogContent>
        <DialogActions>
          <Button onClick={() => props.onClose(false)} variant="contained">
            Cancel
          </Button>
          <Button
            onClick={() => props.onClose(true)}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);
