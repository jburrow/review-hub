import * as React from "react";
import { AppStyles } from "../styles";

export const TextInputDialog = (props: {
  open: boolean;
  onClose({ text: string, confirm: boolean }): void;
  title: string;
}) => {
  // const [text, setText] = React.useState<string>("");
  // const onClose = (confirm) => {
  //   props.onClose({ text, confirm });
  //   setText("");
  // };
  // return (
  //   <Dialog onClose={(e) => onClose(false)} aria-labelledby="simple-dialog-title" open={props.open}>
  //     <DialogTitle id="simple-dialog-title">{props.title}</DialogTitle>
  //     <DialogContent>
  //       <TextField
  //         onChange={(e) => {
  //           setText(e.target.value);
  //         }}
  //         onKeyDown={(e) => {
  //           if (e.key === "Enter" && e.ctrlKey) {
  //             e.preventDefault();
  //             onClose(true);
  //           }
  //         }}
  //         autoFocus
  //         value={text}
  //       ></TextField>
  //     </DialogContent>
  //     <DialogActions>
  //       <Button onClick={() => onClose(false)} variant="contained">
  //         Cancel
  //       </Button>
  //       <Button onClick={() => onClose(true)} variant="contained" color="primary" disabled={text.length == 0}>
  //         Ok
  //       </Button>
  //     </DialogActions>
  //   </Dialog>
  // );

  return null;
};
