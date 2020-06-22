import React from 'react'
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FilterIcon from '@material-ui/icons/FilterList';
import * as _ from 'lodash';
import Tooltip from '@material-ui/core/Tooltip';


const amountRangeTypeFilter = (props) => {
    const columnDef = props.columnDef
    console.log(columnDef)
    // let amountRange = {greaterThan: '', lessThan: ''}
    return (
        <>
        <TextField
        // style={columnDef.type === 'numeric' ? { float: 'right' } : {}}
        // type={columnDef.type === 'numeric' ? 'number' : 'search'}
        // value={_.get(columnDef, ['tableData', 'filterValue', 'greaterThan']) || ''}
        value={props.value}
        placeholder={columnDef.filterPlaceholder || ''}
        onChange={(event) => {
            // const value = {...columnDef.tableData.filterValue};
            const value = props.value
            console.log(value)
            value.greaterThan = event.target.value;
            // amountRange.greaterThan = event.target.value
            props.onFilterChanged(columnDef, value);
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
        value={props.value}
        placeholder={columnDef.filterPlaceholder || ''}
        onChange={(event) => {
            // const value = {...columnDef.tableData.filterValue};
            const value = props.value
            console.log(value)
            value.lessThan = event.target.value;
            // amountRange.lessThan = event.target.value
            props.onFilterChanged(columnDef, value);
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
        </>
    );
}

export default amountRangeTypeFilter