import React, { Component } from 'react'
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FilterIcon from '@material-ui/icons/FilterList';
import * as _ from 'lodash';
import Tooltip from '@material-ui/core/Tooltip';


class AmountRangeTypeFilter extends Component {
    // console.log(columnDef)
    // console.log(props.value)
    // let amountRange = {greaterThan: '', lessThan: ''}
    state = {
        amountRange: {greaterThan: '', lessThan: ''}
    }

    columnDef = this.props.columnDef
    onFilterChanged = (value) => {

        this.props.onFilterChanged(this.columnDef, value)
    }
    render(){
        return (
            <>
            <TextField
            // style={columnDef.type === 'numeric' ? { float: 'right' } : {}}
            // type={columnDef.type === 'numeric' ? 'number' : 'search'}
            // value={_.get(columnDef, ['tableData', 'filterValue', 'greaterThan']) || ''}
            value={_.get(this.props, ['value']) || ''}
            // value={props.value}
            placeholder={this.columnDef.filterPlaceholder || ''}
            onChange={(event) => {
                // const value = {...columnDef.tableData.filterValue};
                // const value = props.value
                // console.log(value)
                // value.greaterThan = event.target.value;
                // amountRange.greaterThan = event.target.value
                // this.onFilterChanged(value);
                // this.setState({})
            }}
            InputProps={this.columnDef.hideFilterIcon ? undefined : {
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
            // value={props.value}
            placeholder={this.columnDef.filterPlaceholder || ''}
            onChange={(event) => {
                // const value = {...columnDef.tableData.filterValue};
                // const value = props.value
                // console.log(value)
                // value.lessThan = event.target.value;
                // amountRange.lessThan = event.target.value
                // this.onFilterChanged(value);
            }}
            InputProps={this.columnDef.hideFilterIcon ? undefined : {
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
    }    

export default AmountRangeTypeFilter