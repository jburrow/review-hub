import { createStyles } from "@material-ui/core";

export const AppStyles = createStyles({
  layout: {
    fontSize: "12px",
    backgroundColor: "#f9f4f633"
    //margin: 5
  },
  version_control: {
    backgroundColor: "#D28C1F33"
  },
  editor: {
    backgroundColor: "#561E8E33"
  },
  script_history: {
    backgroundColor: "#1E518933"
  },
  vc_history: {
    backgroundColor: "#684D2533"
  },
  panel_content: {
    backgroundColor: "lilac",
    height: "100%"
  }
});

export const SelectedStyles = createStyles({
  selectedItem: { textDecoration: "underline", backgroundColor: "orange" },
  inactiveItem: {}
});
