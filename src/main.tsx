import { render } from "react-dom";
import * as React from 'react'
import * as RGL from "react-grid-layout";
import {
    reduceVersionControl, versionControlReducer, VersionControlState,
    FileEvents, FileState, VersionControlEvent, initialVersionControlState, VCDispatch, FileStateX
} from "./events-version-control";
import { DiffEditor, ControlledEditor, monaco } from "@monaco-editor/react";
import 'react-resizable/css/styles.css';
import 'react-grid-layout/css/styles.css';
import { createReviewManager, ReviewManager, ReviewCommentStore, ReviewCommentEvent } from "monaco-review";

import './index.css';

type AppDispatch = (event: AppStateEvents) => void;


const ReactGridLayout = RGL.WidthProvider(RGL);

monaco.init().then(() => console.debug('Monaco has initialized...', (window as any).monaco));

const Editor = (props: { currentUser: string, view: SelectedView, wsDispatch(e: VersionControlEvent): void }) => {
    const [text, setText] = React.useState<string>(null);
    const [comments, setComments] = React.useState<ReviewCommentEvent[]>(null);
    const [reviewManager, setReviewManager] = React.useState<ReviewManager>(null);

    React.useEffect(() => {
        console.debug('load view', props.view?.text, props.view?.original)
        if (props.view) {
            setText(props.view.text);
            setComments([]);
        }
    }, [props.view])

    React.useEffect(() => {
        console.debug('load comments', props.view?.comments?.comments)
        if (reviewManager !== null && props.view) {
            //mx.editor.createModel()
            // const model = ((window as any).monaco).editor.createModel(props.view.text, 'javascript');
            // reviewManager.editor.setModel(model)
            reviewManager.loadFromStore(props.view.comments || { comments: {}, deletedCommentIds: new Set(), dirtyCommentIds: new Set() }, [])
        }
    }, [reviewManager, props.view]);

    function setEditor(editor) {//: monaco.editor.IStandaloneCodeEditor
        const rm = createReviewManager(editor, props.currentUser, [], (c) => { console.log('CONSOLE', c); setComments(c) })
        setReviewManager(rm);
    }



    return props.view && props.view.fullPath ? <div>
        {text !== props.view.text ? <button onClick={() => {
            props.wsDispatch({
                type: 'commit',
                author: props.currentUser,
                events: [{ type: 'edit', fullPath: props.view.fullPath, text: text }]
            })
        }}>Stage Change</button> : <div>not modified text</div>}

        {(comments || []).length ? <button onClick={() => {
            props.wsDispatch({
                type: 'commit',
                author: props.currentUser,
                events: [{ type: 'comment', fullPath: props.view.fullPath, commentEvents: comments }]
            })
            setComments([]);
        }}>Stage Comments {`${comments.length}`}</button> : <div>not modified comments</div>}

        {(comments || []).length && <button onClick={() => {
            setComments([]);
            reviewManager.loadFromStore(props.view.comments || { comments: {}, deletedCommentIds: new Set(), dirtyCommentIds: new Set() }, [])

        }}>Discard Comments</button>}

        {props.view.original ?
            <DiffEditor editorDidMount={(_modified, _original, editor) => {
                editor.getModifiedEditor().onDidChangeModelContent(() => setText(editor.getModifiedEditor().getValue()));
                setEditor(editor.getModifiedEditor());
            }}
                options={{ originalEditable: false }}
                language={"javascript"}
                height={200}
                modified={props.view.text}
                original={props.view.original}
            /> :
            <ControlledEditor value={props.view.text}
                height={200}
                options={{ readOnly: false }}
                editorDidMount={(_, editor) => {
                    setEditor(editor);
                }}
                onChange={(e, t) => setText(t)} />}
    </div> : null;
};


const History = (props: { script: FileState, appDispatch: AppDispatch }) => {
    const [selected, setSelected] = React.useState<number[]>([]);

    const convert = (e: FileStateX) => {
        const comments = e.commentStore?.comments || {};

        return <div>{e.revision}  x{Object.values(comments).length}x "{e.text.substring(0, 10)} ..."</div>
    }

    if (props.script) {
        return <div>{props.script.history.map((h, idx) => (
            <div key={idx} >
                <button onClick={() => {
                    if (selected.indexOf(idx) > -1) {
                        setSelected(selected.filter((i) => i !== idx));
                    } else {
                        setSelected(selected.concat(idx));
                    }
                }}>{selected.indexOf(idx) > -1 ? 'deselect' : 'select'}</button>

                <button onClick={() => props.appDispatch({
                    type: "selectedView",
                    fullPath: props.script.fullPath,
                    text: h.fileState.text,
                    comments: h.fileState.commentStore
                })}>view</button>

                {convert(h.fileState)}
            </div>))}
            {selected.length == 2 && <button onClick={() => {
                const m = props.script.history[selected[1]].fileState;
                const original = props.script.history[selected[0]].fileState;
                props.appDispatch({
                    type: "selectedView",
                    fullPath: props.script.fullPath,
                    label: `base:${original.revision} v other:${m.revision}`,
                    text: m.text,
                    original: m.text,
                    comments: m.commentStore
                })
            }}>diff</button>}
        </div>
    }
    return null;
};

interface AppState {
    selectedScript?: { fullPath: string };
    selectedView?: { fullPath: string, text: string, original?: string, label?: string };
}

interface SelectedView {
    fullPath: string, label?: string, text: string, original?: string, comments?: ReviewCommentStore
}
type AppStateEvents = { type: 'selectScript', fullPath: string } |
    { type: 'selectedView', } & SelectedView;

const reducer = (state: AppState, event: AppStateEvents) => {
    switch (event.type) {
        case "selectScript":
            return { ...state, selectedScript: { fullPath: event.fullPath } }
        case "selectedView":
            return {
                ...state, selectedView: {
                    fullPath: event.fullPath,
                    text: event.text,
                    original: event.original,
                    label: event.label,
                    comments: event.comments
                }
            }
    }
    return state;
}

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

export const App = () => {
    const [appState, appDispatch] = React.useReducer(reducer, {});
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
        >
            <div key="0.1" data-grid={{ x: 0, y: 0, w: 3, h: 8 }} style={{ backgroundColor: 'pink', }}>
                <div className="fish">
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
            </div>
            <div key="0.2" data-grid={{ x: 3, y: 0, w: 6, h: 8, }} style={{ backgroundColor: 'yellow', }} >
                {appState.selectedView ? <h5>Editor - {appState.selectedView.fullPath} - {appState.selectedView.label}</h5> : 'Editor'}
                <div className="fish" style={{ height: "calc(100% - 100px)", backgroundColor: 'red' }}>

                    <Editor currentUser={currentUser} view={appState.selectedView}

                        wsDispatch={wsDispatch} />
                </div>
            </div>
            <div key="0.3" data-grid={{ x: 9, y: 0, w: 3, h: 8 }} style={{ backgroundColor: 'orange', }}>
                <h3>History</h3>
                <div className="fish">
                    <History script={appState.selectedScript && vcStore.files[appState.selectedScript.fullPath]}
                        appDispatch={appDispatch}
                    />
                </div>
            </div>
            <div key="1.1" data-grid={{ x: 0, y: 1, w: 12, h: 10 }} style={{ backgroundColor: 'cyan', }}>
                <h3>VC History</h3>
                <div className="fish">
                    <VCHistory vcStore={vcStore} />
                </div>
                {vcStore.version}
            </div>
        </ReactGridLayout>
    );
}

const VCHistory = (props: { vcStore: VersionControlState }) => {
    const rows = [];
    for (const e of props.vcStore.events) {
        if (e.type == 'commit') {
            rows.push(`commit: ${e.id}`)
            for (const fe of e.events) {
                rows.push(JSON.stringify(fe))
            }
        }
    }
    return <div>
        {rows.reverse().map((r, idx) => <div key={idx}>{r}</div>)}
    </div>
}


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