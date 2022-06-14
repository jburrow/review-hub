import * as React from "react";
import { AppStyles } from "../styles";

export const RenameDialog = (props: {
  open: boolean;
  onClose({ newFullPath: string, rename: boolean }): void;
  fullPath: string;
}) => {
  //const [newFullPath, setNewFullPath] = React.useState<string>(props.fullPath);
  // return (
  //   <Dialog
  //     onClose={(e) => {
  //       props.onClose({ newFullPath, rename: true });
  //     }}
  //     aria-labelledby="simple-dialog-title"
  //     open={props.open}
  //   >
  //     <DialogTitle id="simple-dialog-title">Rename File</DialogTitle>
  //     <DialogContent>
  //       <TextField
  //         onChange={(e) => {
  //           setNewFullPath(e.target.value);
  //         }}
  //         value={newFullPath}
  //       ></TextField>
  //     </DialogContent>
  //     <DialogActions>
  //       <Button onClick={() => props.onClose({ newFullPath, rename: false })} variant="contained">
  //         Cancel
  //       </Button>
  //       <Button
  //         onClick={() => props.onClose({ newFullPath, rename: true })}
  //         disabled={newFullPath == props.fullPath}
  //         variant="contained"
  //         color="primary"
  //       >
  //         Rename
  //       </Button>
  //     </DialogActions>
  //   </Dialog>

  return null;
  //);
};
