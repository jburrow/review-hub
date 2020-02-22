import * as React from 'react'
import { VersionControlState } from "../events-version-control";

export const VCHistory = (props: { vcStore: VersionControlState }) => {
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