import { Button, DialogActions, DialogContent, TextField, withStyles, WithStyles } from "@material-ui/core";
import * as React from "react";
import { AppStyles } from "../styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

export const TextInputDialog = withStyles(AppStyles)(
  (
    props: {
      open: boolean;
      onClose({ text: string, confirm: boolean }): void;
      title: string;
    } & WithStyles<typeof AppStyles>
  ) => {
    const [text, setText] = React.useState<string>("");
    const onClose = (confirm) => {
      props.onClose({ text, confirm });
      setText("");
    };
    return (
      <Dialog onClose={(e) => onClose(false)} aria-labelledby="simple-dialog-title" open={props.open}>
        <DialogTitle id="simple-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <TextField
            onChange={(e) => {
              setText(e.target.value);
            }}
            value={text}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(false)} variant="contained">
            Cancel
          </Button>
          <Button onClick={() => onClose(true)} variant="contained" color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);
