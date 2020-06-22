import React from 'react'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';

const dateRangeFilter = (props) => {
    const columnDef = props.columnDef
    return(
        <DateRangePicker
            onChange={(dateRange) => {
                const value = {...columnDef.tableData.filterValue};
                value.dateRange = dateRange
                props.onFilterChanged(columnDef, value);
            }}
            value={props.dateRange}
        />
    )
}
export default dateRangeFilter