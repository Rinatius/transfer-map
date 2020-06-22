import React, { useState } from 'react'
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FilterIcon from '@material-ui/icons/FilterList';
import * as _ from 'lodash';
import cloneDeep from 'lodash/cloneDeep';
import Tooltip from '@material-ui/core/Tooltip';


const AmountRangeTypeFilter = (props) => {
    const columnDef = props.columnDef
    console.log(columnDef)
    console.log(props.value)
    // let amountRange = {greaterThan: '', lessThan: ''}
    // let lessThan = ''
    // let greaterThan = ''
    const [greaterThan, setGreater] = useState('')
    const [lessThan, setLess] = useState('')

    return (
        <div>
        <TextField
        // style={columnDef.type === 'numeric' ? { float: 'right' } : {}}
        // type={columnDef.type === 'numeric' ? 'number' : 'search'}
        // value={_.get(columnDef, ['tableData', 'filterValue', 'greaterThan']) || ''}
        // value={_.get(props, ['value']) || ''}
        // value={props.value.greaterThan}
        value={_.get(props.value, ['greaterThan']) || ''}
        placeholder={columnDef.filterPlaceholder || ''}
        onChange={(event) => {
            // const value = {...columnDef.tableData.filterValue};
            console.log(props)
            setGreater(event.target.value)
            // amountRange.greaterThan = event.target.value
            // amountRange.greaterThan = event.target.value
            // console.log(amountRange)
            props.onFilterChanged(columnDef, {greaterThan: event.target.value, lessThan: lessThan});
        }}
        InputProps={columnDef.hideFilterIcon ? undefined : {
            startAdornment: (
            <InputAdornment position="start">
                <Tooltip title="Filter greater than">
                <div style={{display: 'flex'}}>
                    <FilterIcon />
                    <Typography>{'>'}</Typography>
                </div>
                </Tooltip>
            </InputAdornment>
            )
        }}
        />
        <TextField
        // style={columnDef.type === 'numeric' ? { float: 'right' } : {}}
        // type={columnDef.type === 'numeric' ? 'number' : 'search'}
        // value={_.get(columnDef, ['tableData', 'filterValue', 'lessThan']) || ''}
        value={_.get(props.value, ['lessThan']) || ''}
        placeholder={columnDef.filterPlaceholder || ''}
        onChange={(event) => {
            // const value = {...columnDef.tableData.filterValue};
            setLess(event.target.value)
            // amountRange.lessThan = event.target.value
            // amountRange.lessThan = event.target.value
            // console.log(amountRange)
            props.onFilterChanged(columnDef, {greaterThan: greaterThan, lessThan: event.target.value});
        }}
        InputProps={columnDef.hideFilterIcon ? undefined : {
            startAdornment: (
            <InputAdornment position="start">
                <Tooltip title="Filter less than">
                <div style={{display: 'flex'}}>
                    <FilterIcon />
                    <Typography>{'<'}</Typography>
                </div>
                </Tooltip>
            </InputAdornment>
            )
        }}
        />
        </div>
    );
}

export default AmountRangeTypeFilter