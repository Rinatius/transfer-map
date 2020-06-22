import React from 'react'
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FilterIcon from '@material-ui/icons/FilterList';
import * as _ from 'lodash';
import Tooltip from '@material-ui/core/Tooltip';


const amountRangeTypeFilter = (props) => {
    const columnDef = props.columnDef

    let style = {}
    if (columnDef.filterCellStyle) {
        style = columnDef.filterCellStyle}
    else {
        style = props.style
    }

    return (
        <>
        <TextField
        style={style}
        // style={columnDef.type === 'numeric' ? { float: 'right' } : {}}
        // type={columnDef.type === 'numeric' ? 'number' : 'search'}
        // value={columnDef['tableData']['filterValue']['greaterThan'] || ''}
        placeholder={columnDef.filterPlaceholder || ''}
        onChange={(event) => {
            const value = {...columnDef.tableData.filterValue};
            value.greaterThan = event.target.value;
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
        style={style}
        // style={columnDef.type === 'numeric' ? { float: 'right' } : {}}
        // type={columnDef.type === 'numeric' ? 'number' : 'search'}
        // value={_.get(columnDef, ['tableData', 'filterValue', 'lessThan']) || ''}
        placeholder={columnDef.filterPlaceholder || ''}
        onChange={(event) => {
            const value = {...columnDef.tableData.filterValue};
            value.lessThan = event.target.value;
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