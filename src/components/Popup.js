import React from 'react'

export default function Popup (props) {
    return(
        <div>
            {props.fields.map(f => {
                return <div>
                    <h6>{f.des}</h6>
                    {
                        f.type === "select" && 
                        <select key={f.name} name={f.name} onChange={props.onChange}>
                            <option value={null}>please choose and option</option>
                            {f.options.map(o => {
                                return <option key={o} value={o}>{o}</option>
                            })}
                        </select>
                    }
                </div> 
            })}
        </div>
    )
}