import React from 'react'
import TextField from '@material-ui/core/TextField';

const defaultFilter = (props) => {
    let columnDef = props.columnDef
    console.log(columnDef)
    return (
        <TextField 
            placeholder={columnDef.filterPlaceholder} 
            onChange={event => {
                props.onFilterChanged(columnDef, event.target.value)
            }
        }
        // value={columnDef.tableData.filterValue}
        />
    );
}

export default defaultFilter