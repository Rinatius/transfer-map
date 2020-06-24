/* eslint-disable no-unused-vars */
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FilterIcon from '@material-ui/icons/FilterList';
import * as _ from 'lodash';
import * as React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, TimePicker, DatePicker, DateTimePicker } from '@material-ui/pickers';
import { Button } from '@material-ui/core';
//import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import DateRangePicker from '@wojtekmaj/react-daterange-picker/dist/entry.nostyle';
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

class MTableFilterRow extends React.Component {
  getLocalizationData = () => ({ ...MTableFilterRow.defaultProps.localization, ...this.props.localization });
  getLocalizedFilterPlaceHolder = columnDef => columnDef.filterPlaceholder || this.getLocalizationData().filterPlaceHolder || "";

  renderLookupFilter = (columnDef) => (
    <FormControl style={{ width: '100%' }}>
      <InputLabel htmlFor="select-multiple-checkbox" style={{marginTop: -16}}>{this.getLocalizedFilterPlaceHolder(columnDef)}</InputLabel>
      <Select
        multiple
        value={columnDef.tableData.filterValue || []}
        onChange={event => {
          this.props.onFilterChanged(columnDef.tableData.id, event.target.value);
        }}
        input={<Input id="select-multiple-checkbox" />}
        renderValue={selecteds => selecteds.map(selected => columnDef.lookup[selected]).join(', ')}
        MenuProps={MenuProps}
        style={{...this.props.cellStyle, marginTop: 0}}
        disableUnderline
      >
        {
          Object.keys(columnDef.lookup).map(key => (
            <MenuItem key={key} value={key}>
              <Checkbox checked={columnDef.tableData.filterValue ? columnDef.tableData.filterValue.indexOf(key.toString()) > -1 : false} />
              <ListItemText primary={columnDef.lookup[key]} disableTypography />
            </MenuItem>
          ))
        }
      </Select>
    </FormControl>
  )

  renderFilterComponent = (columnDef) => (
    React.createElement(columnDef.filterComponent, { columnDef: columnDef, onFilterChanged: this.props.onFilterChanged })
  )

  renderBooleanFilter = (columnDef) => (
    <Checkbox
      indeterminate={columnDef.tableData.filterValue === undefined}
      checked={columnDef.tableData.filterValue === 'checked'}
      onChange={() => {
        let val;
        if (columnDef.tableData.filterValue === undefined) {
          val = 'checked';
        } else if (columnDef.tableData.filterValue === 'checked') {
          val = 'unchecked';
        }

        this.props.onFilterChanged(columnDef.tableData.id, val);
      }}
    />
  )

  renderDefaultFilter = (columnDef) => {
    const localization = this.getLocalizationData();
    const FilterIcon = this.props.icons.Filter;
    return (
      <TextField
        // style={columnDef.type === 'numeric' ? { float: 'right' } : {}}
        style={this.props.cellStyle}
        type={columnDef.type === 'numeric' ? 'number' : 'search'}
        value={columnDef.tableData.filterValue || ''}
        placeholder={this.getLocalizedFilterPlaceHolder(columnDef)}
        onChange={(event) => {
          this.props.onFilterChanged(columnDef.tableData.id, event.target.value);
        }}
        inputProps={{'aria-label': `filter data by ${columnDef.title}`}}
        InputProps={this.props.hideFilterIcons || columnDef.hideFilterIcon ? undefined : {
          startAdornment: (
            <InputAdornment position="start">
              <Tooltip title={localization.filterTooltip}>
                <FilterIcon/>
              </Tooltip>
            </InputAdornment>
          )
        }}
      />
    );
  }

  renderDateTypeFilter = (columnDef) => {
    const onDateInputChange = date => this.props.onFilterChanged(columnDef.tableData.id, date);
    const pickerProps = {
      value: columnDef.tableData.filterValue || null,
      onChange: onDateInputChange,
      placeholder: this.getLocalizedFilterPlaceHolder(columnDef),
      clearable: true
    };

    let dateInputElement = null;
    if (columnDef.type === 'date') {
      dateInputElement = (
        <DatePicker {...pickerProps} />
      );
    } else if (columnDef.type === 'datetime') {
      dateInputElement = (
        <DateTimePicker {...pickerProps} />
      );
    } else if (columnDef.type === 'time') {
      dateInputElement = (
        <TimePicker {...pickerProps} />
      );
    }
    return (
      <MuiPickersUtilsProvider
        utils={DateFnsUtils}
        locale={this.props.localization.dateTimePickerLocalization}>
        {dateInputElement}
      </MuiPickersUtilsProvider>
    );
  }

  renderDateRangeTypeFilter = (columnDef) => {
    return(
      <DateRangePicker
        onChange={(dateRange) => {
          console.log('on change')
          const value = {...columnDef.tableData.filterValue};
          console.log(value)
          value.dateRange = dateRange
          this.props.dateRangeChange(dateRange)
          this.props.onFilterChanged(columnDef.tableData.id, value);
        }}
        value={this.props.dateRange}
			/>
    )
  }


  renderAmountRangeTypeFilter = (columnDef) => {
    return (
      <Box display="flex">
      <TextField
        //style={columnDef.type === 'numeric' ? { float: 'right' } : {}}
        style={this.props.cellStyle}
        type={columnDef.type === 'numeric' ? 'number' : 'search'}
        value={_.get(columnDef, ['tableData', 'filterValue', 'greaterThan']) || ''}
        //placeholder={columnDef.filterPlaceholder || ''}
        placeholder={this.getLocalizedFilterPlaceHolder(columnDef)}
        onChange={(event) => {
          console.log('on change')
          const value = {...columnDef.tableData.filterValue};
          console.log(value)
          value.greaterThan = event.target.value;
          this.props.onFilterChanged(columnDef.tableData.id, value);
        }}
        InputProps={
          columnDef.hideFilterIcon ? undefined : {
          disableUnderline: true,
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
        style={this.props.cellStyle}
        type={columnDef.type === 'numeric' ? 'number' : 'search'}
        value={_.get(columnDef, ['tableData', 'filterValue', 'lessThan']) || ''}
        placeholder={columnDef.filterPlaceholder || ''}
        onChange={(event) => {
          const value = {...columnDef.tableData.filterValue};
          value.lessThan = event.target.value;
          this.props.onFilterChanged(columnDef.tableData.id, value);
        }}
        InputProps={columnDef.hideFilterIcon ? undefined : {
          disableUnderline: true,
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
      </Box>
    );
  }

  getComponentForColumn(columnDef) {
    if (columnDef.filtering === false) {
      return null;
    }

    if (columnDef.field || columnDef.customFilterAndSearch) {
      if (columnDef.filterComponent) {
        return this.renderFilterComponent(columnDef);
      } else if (columnDef.lookup) {
        return this.renderLookupFilter(columnDef);
      } else if (columnDef.type === 'boolean') {
        return this.renderBooleanFilter(columnDef);
      } else if (['date', 'datetime', 'time'].includes(columnDef.type)) {
        return this.renderDateTypeFilter(columnDef);
      } else if (columnDef.type === 'number_range'){
        return this.renderAmountRangeTypeFilter(columnDef)
      } else if (columnDef.type === 'date_range') {
        return this.renderDateRangeTypeFilter(columnDef)
      } else {
        return this.renderDefaultFilter(columnDef);
      }
    }
  }



  render() {
    const columns = this.props.columns
      .filter(columnDef => columnDef.filtering && !(columnDef.tableData.groupOrder > -1))
      .sort((a, b) => a.tableData.columnOrder - b.tableData.columnOrder)
      .map(columnDef => (
        // <Box key={columnDef.tableData.id} style={this.props.boxStyle}>
        //   {this.getComponentForColumn(columnDef)}
        // </Box>
        <Grid item xs="auto" sm="auto" md="auto" key={columnDef.tableData.id} style={this.props.boxStyle}>
          {this.getComponentForColumn(columnDef)}
        </Grid>
      ));

    ///////////Здесь был Атай///////////

    columns.push(
    <Box key={"filters-reset-button"}>
      <button className={"filters-reset-button"} 
        onClick={this.props.resetFilters}
        style={{
          ...this.props.boxStyle,
          backgroundColor: 'Transparent',
          backgroundRepeat:'no-repeat',
          border: 'none',
          cursor:'pointer',
          overflow: 'hidden',
          outline:'none',
          // position: 'absolute',
          // right: 0,
        }} ><Typography variant="body2">Reset all filters</Typography>
      </button>
    </Box>
    );
    
    ///////////Атай был здесь///////////
    

    return (
      <TableRow>
		<Grid container style={{paddingLeft: '20px'}}
		id="table-header"
        direction="row"
        justify="left"
        alignItems="center">
          {columns}
        </Grid>
      </TableRow>
    );
  }
}

MTableFilterRow.defaultProps = {
  columns: [],
  selection: false,
  hasActions: false,
  localization: {
    filterTooltip: 'Filter'
  },
  hideFilterIcons: false,
};

MTableFilterRow.propTypes = {
  columns: PropTypes.array.isRequired,
  hasDetailPanel: PropTypes.bool.isRequired,
  isTreeData: PropTypes.bool.isRequired,
  onFilterChanged: PropTypes.func.isRequired,
  filterCellStyle: PropTypes.object,
  selection: PropTypes.bool.isRequired,
  actionsColumnIndex: PropTypes.number,
  hasActions: PropTypes.bool,
  localization: PropTypes.object,
  hideFilterIcons: PropTypes.bool,
};

export default MTableFilterRow;
