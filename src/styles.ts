import { createStyles } from "@material-ui/core";

const panelHeadingHeight = "20px";

export const AppStyles = createStyles({
  layout: {
    fontSize: "12px",
    backgroundColor: "#f9f4f633",
    overflow: "hidden"
  },
  header_bar: {backgroundColor:"#224D2533"},
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
    height: `calc(100% - ${panelHeadingHeight})`,
    overflow: "auto"
  },
  panel_heading: {
    height: panelHeadingHeight
  }
});

export const SelectedStyles = createStyles({
  selectedItem: { textDecoration: "underline", backgroundColor: "orange" },
  inactiveItem: {}
});
