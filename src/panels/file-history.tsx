
import * as React from 'react'
import { AppDispatch } from "../store";
import { FileState, FileStateX } from "../events-version-control";

export const FileHistory = (props: { file: FileState, appDispatch: AppDispatch }) => {
    const [selected, setSelected] = React.useState<number[]>([]);

    const convert = (e: FileStateX) => {
        const comments = e.commentStore?.comments || {};

        return <div>{e.revision}  x{Object.values(comments).length}x "{e.text.substring(0, 10)} ..."</div>
    }

    if (props.file) {
        return <div>{props.file.history.map((h, idx) => (
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
                    fullPath: props.file.fullPath,
                    text: h.fileState.text,
                    comments: h.fileState.commentStore
                })}>view</button>

                {convert(h.fileState)}
            </div>))}
            {selected.length == 2 && <button onClick={() => {
                const m = props.file.history[selected[1]].fileState;
                const original = props.file.history[selected[0]].fileState;
                props.appDispatch({
                    type: "selectedView",
                    fullPath: props.file.fullPath,
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
