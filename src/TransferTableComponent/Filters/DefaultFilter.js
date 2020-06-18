import React from 'react'
import TextField from '@material-ui/core/TextField';

const defaultFilter = (props) => {
    let columnDef = props.columnDef
    return (
        <TextField onChange={event => {
            props.onFilterChanged(columnDef.tableData.id, event.target.value)
        }}
        />
    );
}

export default defaultFilter