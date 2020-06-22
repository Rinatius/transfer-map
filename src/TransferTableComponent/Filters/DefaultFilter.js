import React from 'react'
import TextField from '@material-ui/core/TextField';
import * as _ from 'lodash';

const defaultFilter = (props) => {
    let columnDef = props.columnDef
    // const value = _.get(columnDef, ['tableData', 'filterValue']) || '' 
    console.log(props.value)
    // console.log(value)
    return (
        <TextField 
            placeholder={columnDef.filterPlaceholder} 
            onChange={event => {
                props.onFilterChanged(columnDef, event.target.value)
            }
        }
        value={props.value}
        />
    );
}

export default defaultFilter