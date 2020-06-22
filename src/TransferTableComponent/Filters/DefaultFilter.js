import React from 'react'
import TextField from '@material-ui/core/TextField';

const defaultFilter = (props) => {
    let columnDef = props.columnDef
    let style = {}
    if (columnDef.filterCellStyle) {
        style = columnDef.filterCellStyle}
    else {
        style = props.style
    }

    return (
        <TextField style={style} placeholder={columnDef.filterPlaceholder} onChange={event => {
            props.onFilterChanged(columnDef, event.target.value)
        }}
        />
    );
}

export default defaultFilter