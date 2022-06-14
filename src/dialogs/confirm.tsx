import * as React from "react";
import { AppStyles } from "../styles";

export const ConfirmDialog = (props: { open: boolean; onClose(boolean): void; title: string; message: string }) => {
  return null;
  // return (
  //   <Dialog
  //     onClose={(e) => {
  //       props.onClose(false);
  //     }}
  //     aria-labelledby="simple-dialog-title"
  //     open={props.open}
  //   >
  //     <DialogTitle id="simple-dialog-title">{props.title}</DialogTitle>
  //     <DialogContent>{props.message}</DialogContent>
  //     <DialogActions>
  //       <Button onClick={() => props.onClose(false)} variant="contained">
  //         Cancel
  //       </Button>
  //       <Button onClick={() => props.onClose(true)} variant="contained" color="primary">
  //         Confirm
  //       </Button>
  //     </DialogActions>
  //   </Dialog>
  // );
};
