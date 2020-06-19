import React from 'react'
import TextField from '@material-ui/core/TextField';

const defaultFilter = (props) => {
    let columnDef = props.columnDef
    return (
        <TextField placeholder={columnDef.filterPlaceholder} onChange={event => {
            props.onFilterChanged(columnDef, event.target.value)
        }}
        />
    );
}

export default defaultFilter