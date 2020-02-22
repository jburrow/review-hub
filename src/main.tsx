import { monaco } from "@monaco-editor/react";
import * as React from 'react';
import { render } from "react-dom";
import * as RGL from "react-grid-layout";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { FileEvents, FileState, initialVersionControlState, reduceVersionControl, VCDispatch, VersionControlEvent, versionControlReducer, VersionControlState } from "./events-version-control";
import './index.css';
import { Editor } from "./panels/editor";
import { FileHistory } from "./panels/file-history";
import { VCHistory } from "./panels/vchistory";
import { AppDispatch, reducer } from "./store";
import { withStyles, createStyles, WithStyles } from "@material-ui/core";

const ReactGridLayout = RGL.WidthProvider(RGL);

monaco.init().then(() => console.debug('Monaco has initialized...', (window as any).monaco));



function loadVersionControlStore(): VersionControlState {
    const events: FileEvents[] = [
        { fullPath: "/script1.py", text: "function version(){ return 's1.1'}", type: "edit" },
        { fullPath: "/script2.py", text: "function version(){ return 's2.1'}", type: "edit" },
        { fullPath: "/script3.py", text: "function version(){ return 's3.1'}", type: "edit" }];

    const store = reduceVersionControl([{
        type: "commit", author: "james", id: 'id-0',
        events: events
    }, {
        type: "commit", author: "james", id: 'id-1',
        events: [{ fullPath: "/script1.py", text: "function version(){ return 's1.2'}", type: "edit" }]
    }, {
        type: "commit", author: "james", id: 'id-2',
        events: [{ fullPath: "/script1.py", text: "function version(){ return 's1.3'}", type: "edit" }]
    }, {
        type: "commit", author: "james", id: 'id-4',
        events: [{
            fullPath: "/script1.py", commentEvents: [
                { lineNumber: 1, text: '', type: 'create', createdAt: '', createdBy: 'xxx', id: '1', }], type: "comment"
        }]
    }]);

    return store;
}

interface DataGridItemProps {
    key: string, dataGrid: any, className: string
}
const DataGridItem: React.FunctionComponent<DataGridItemProps> = (props) => {
    return <div key={props.key} data-grid={props.dataGrid} className={props.className}>
        {JSON.stringify(props.dataGrid)}
        <div className="fish">{props.children}</div>
    </div>;
}

const AppStyles = createStyles({
    layout:{
        fontSize:'12px',
        backgroundColor:'#f9f4f6'
    },
    version_control: {
        backgroundColor: '#bf8da5'
    },
    editor:{
        backgroundColor:'#ead9e1'
    },
    script_history:{
        backgroundColor:'#d4b3c3'
    },
    vc_history:{
        backgroundColor:'#894d69'
    }
});
//https://www.w3schools.com/w3css/w3css_color_generator.asp
//  w3-theme-l5
// # w3-theme-l4
// # w3-theme-l3
// #bf8da5 w3-theme-l2
// #aa6886 w3-theme-l1
// #894d69

export const App = withStyles(AppStyles)((props: WithStyles<typeof AppStyles>) => {
    const [appStore, appDispatch] = React.useReducer(reducer, {});
    const [vcStore, vcDispatch] = React.useReducer(versionControlReducer, loadVersionControlStore());
    const [wsStore, wsDispatch] = React.useReducer(versionControlReducer, initialVersionControlState());

    const currentUser = 'xyz-user';

    return (
        <ReactGridLayout
            rowHeight={30}
            maxRows={20}
            compactType={'vertical'}
            cols={12}
            useCSSTransforms={false}
            draggableCancel={".fish"}
            className={props.classes.layout}
        >

            <div key="0.1" data-grid={{ x: 0, y: 0, w: 3, h: 8 }} className={props.classes.version_control}>

                <h3>version-control</h3>
                <SCM appDispatch={appDispatch} files={vcStore.files} />
                {vcStore.events.length}

                <StagingSCM vcDispatch={vcDispatch}
                    wsDispatch={wsDispatch}
                    appDispatch={appDispatch}
                    events={wsStore.events}
                    wsfiles={wsStore.files}
                    vcfiles={vcStore.files}></StagingSCM>

            </div>

            <div key="0.2" data-grid={{ x: 3, y: 0, w: 6, h: 8, }} className={props.classes.editor} >
                {appStore.selectedView ? <h5>Editor - {appStore.selectedView.fullPath} - {appStore.selectedView.label}</h5> : 'Editor'}
                <div className="fish">
                    <Editor currentUser={currentUser} view={appStore.selectedView}
                        wsDispatch={wsDispatch} />
                </div>
            </div>
            <div key="0.3" data-grid={{ x: 9, y: 0, w: 3, h: 8 }} className={props.classes.script_history}>
                <h3>File History {appStore.selectedFile?.fullPath}</h3>
                <div className="fish">
                    <FileHistory file={appStore.selectedFile && vcStore.files[appStore.selectedFile.fullPath]}
                        appDispatch={appDispatch}
                    />
                </div>
            </div>
            <div key="1.1" data-grid={{ x: 0, y: 1, w: 12, h: 10 }} className={props.classes.vc_history}>
                <h3>VC History</h3>
                <div className="fish">
                    <VCHistory vcStore={vcStore} />
                    <div>{vcStore.version}</div>
                </div>
               
            </div>
        </ReactGridLayout>
    );
})



const StagingSCM = (props: {
    wsfiles: Record<string, FileState>,
    vcfiles: Record<string, FileState>,
    events: VersionControlEvent[], wsDispatch: VCDispatch,
    vcDispatch: VCDispatch, appDispatch: AppDispatch
}) => {
    return (<div>
        <h3>working set</h3>
        <SCM appDispatch={props.appDispatch} files={props.wsfiles} />

        <button onClick={() => {
            let events = [];
            for (const e of props.events) {
                if (e.type == 'commit') {
                    events = events.concat(e.events);
                }
            }

            props.vcDispatch({
                type: "commit", author: "james", id: 'id-2',
                events: events
            })
            props.wsDispatch({ type: "reset" });

        }} disabled={props.events.length == 0}>Commit</button>

        <button onClick={() => {
            props.wsDispatch({ type: "reset" });
        }} disabled={props.events.length == 0}>Discard Changes</button>
    </div>)
}

const SCM = (props: { files: Record<string, FileState>, appDispatch: AppDispatch }) => {
    const handleClick = (fullPath: string) => {
        const value = props.files[fullPath];
        props.appDispatch({ type: 'selectScript', fullPath: value.fullPath })
        props.appDispatch({ type: 'selectedView', fullPath: value.fullPath, text: value.text, comments: value.commentStore });
    };

    const items = Object.entries(props.files).map(([key, value]) => <SCMItem key={value.fullPath} fullPath={value.fullPath} revision={value.revision.toString()} onClick={handleClick} />);
    return <ul>{items}</ul>
}

const SCMItem = (props: { fullPath: string, revision: string, onClick(fullPath: string): void }) => {
    return <li onClick={() => props.onClick(props.fullPath)}>{props.fullPath} @ v{props.revision}</li>
}

render(<App />, document.getElementById('root'));