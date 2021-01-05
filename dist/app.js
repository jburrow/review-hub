"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const core_1 = require("@material-ui/core");
const RGL = require("react-grid-layout");
const events_version_control_1 = require("./events-version-control");
const styles_1 = require("./styles");
const React = require("react");
const ReactGridLayout = RGL.WidthProvider(RGL);
class LocalStoragePersistence {
    save(store) { }
    load() {
        return events_version_control_1.initialVersionControlState();
    }
}
const initialState = {
    interactionStore: { currentUser: "xyz-user" },
    wsStore: events_version_control_1.initialVersionControlState(),
    vcStore: events_version_control_1.initialVersionControlState(),
};
exports.App = core_1.withStyles(styles_1.AppStyles)((props) => {
    // const persistence = props.persistence || new LocalStoragePersistence();
    // const [store, dispatch] = React.useReducer(appReducer, initialState);
    // const { innerHeight } = useWindowSize();
    // React.useEffect(() => {
    //   if (props.options.loadOnStartup) {
    //     dispatch({ type: "load", vcStore: persistence.load() });
    //   }
    // }, [props.options?.loadOnStartup]);
    // React.useEffect(() => {
    //   if (props.currentUser) {
    //     dispatch({ type: "setCurrentUser", user: props.currentUser });
    //   }
    // }, [props.currentUser]);
    // const isHeadCommit =
    //   store.interactionStore.selectedCommitId &&
    //   store.vcStore.headCommitId != store.interactionStore.selectedCommitId;
    // const items = [];
    // if (props.options.showToolbar) {
    //   items.push(
    //     <div
    //       key="0.0"
    //       data-grid={{ x: 0, y: 0, w: 12, h: 1.2 }}
    //       className={props.classes.header_bar}
    //     >
    //       <PanelHeading>Review-Hub</PanelHeading>
    //       <PanelContent>
    //         <Button
    //           size="small"
    //           onClick={() =>
    //             dispatch({ type: "load", vcStore: persistence.load() })
    //           }
    //         >
    //           (Persistence) Load
    //         </Button>
    //         <Button
    //           size="small"
    //           onClick={() => persistence.save(store.vcStore)}
    //         >
    //           (Persistence) Save
    //         </Button>
    //         <Button
    //           size="small"
    //           onClick={() => {
    //             generateZip({
    //               ...store.vcStore.files,
    //               ...store.wsStore.files,
    //             });
    //           }}
    //           startIcon={<GetAppIcon />}
    //         >
    //           Download Code As Zip
    //         </Button>
    //       </PanelContent>
    //     </div>
    //   );
    // }
    return (
    // // <ReactGridLayout
    // //   rowHeight={(innerHeight - 70) / 20}
    // //   maxRows={20}
    // //   compactType={"vertical"}
    // //   cols={12}
    // //   margin={[5, 5]}
    // //   containerPadding={[5, 5]}
    // //   useCSSTransforms={true}
    // //   draggableCancel={props.classes.panel_content}
    // //   className={props.classes.layout}
    // // >
    // //   {items}
    // <div>
    //   <div
    //     key="0.1"
    //     data-grid={{ x: 0, y: 1, w: 3, h: 13 }}
    //     className={props.classes.version_control}
    //   >
    //     <PanelHeading>
    //       version-control{" "}
    //       {isHeadCommit ? store.interactionStore.selectedCommitId : "HEAD"}
    //       {isHeadCommit && (
    //         <button
    //           onClick={() =>
    //             dispatch({ type: "selectCommit", commitId: null })
    //           }
    //         >
    //           Switch to HEAD
    //         </button>
    //       )}
    //     </PanelHeading>
    //     <PanelContent>
    //       <SCMPanel
    //         store={store}
    //         isHeadCommit={isHeadCommit}
    //         dispatch={dispatch}
    //       />
    //     </PanelContent>
    //   </div>
    //   <div
    //     key="0.2"
    //     data-grid={{ x: 3, y: 1, w: 6, h: 13 }}
    //     className={props.classes.editor}
    //   >
    //     <PanelHeading>
    //       {!store.interactionStore.selectedView?.fullPath
    //         ? "Editor"
    //         : `Editor - ${store.interactionStore.selectedView?.fullPath} @ ${
    //             store.interactionStore.selectedView?.revision
    //           } ${store.interactionStore.selectedView?.label || ""}`}
    //     </PanelHeading>
    //     <PanelContent>
    //       <Editor
    //         currentUser={store.interactionStore.currentUser}
    //         view={store.interactionStore.selectedView}
    //         dispatch={dispatch}
    //       />
    //     </PanelContent>
    //   </div>
    //   <div
    //     key="0.3"
    //     data-grid={{ x: 9, y: 1, w: 3, h: 13 }}
    //     className={props.classes.script_history}
    //   >
    //     <PanelHeading>
    //       File History {store.interactionStore.selectedFile}
    //     </PanelHeading>
    //     <PanelContent>
    //       <FileHistory
    //         file={
    //           store.interactionStore.selectedFile &&
    //           store.vcStore.files[store.interactionStore.selectedFile]
    //         }
    //         selectedView={store.interactionStore.selectedView}
    //         dispatch={dispatch}
    //       />
    //     </PanelContent>
    //   </div>
    //   <div
    //     key="1.1"
    //     data-grid={{ x: 0, y: 2, w: 12, h: 5 }}
    //     className={props.classes.vc_history}
    //   >
    //     <PanelHeading>VC History</PanelHeading>
    //     <PanelContent>
    //       <VCHistory
    //         vcStore={store.vcStore}
    //         dispatch={dispatch}
    //         selectedCommitId={store.interactionStore.selectedCommitId}
    //         selectedView={store.interactionStore.selectedView}
    //       />
    //       <div>{store.vcStore.version}</div>
    //     </PanelContent>
    //   </div>
    // </ReactGridLayout>
    React.createElement("div", null));
});
const PanelContent = core_1.withStyles(styles_1.AppStyles)((props) => {
    return (React.createElement("div", { className: props.classes.panel_content, onMouseDown: (e) => e.stopPropagation(), onClick: (e) => e.stopPropagation() }, props.children));
});
const PanelHeading = core_1.withStyles(styles_1.AppStyles)((props) => {
    return React.createElement("div", { className: props.classes.panel_heading }, props.children);
});
//# sourceMappingURL=app.js.map