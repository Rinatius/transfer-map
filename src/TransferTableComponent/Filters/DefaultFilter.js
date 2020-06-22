import React, { useEffect, useState } from 'react'
import TextField from '@material-ui/core/TextField';
import * as _ from 'lodash';

const DefaultFilter = (props) => {
    let columnDef = props.columnDef
    const [value, setValue] = useState('')
    
    useEffect(() => {
            setValue(props.value)
    }, [props.value])

    return (
        <TextField 
            placeholder={columnDef.filterPlaceholder} 
            onChange={event => {
                setValue(event.target.value)
                props.onFilterChanged(props.configKey, event.target.value)
            }
        }
        value={value}
        />
    );
}

export default DefaultFilter