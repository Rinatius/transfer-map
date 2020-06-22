import React from 'react'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';

const dateRangeFilter = (props) => {
    const columnDef = props.columnDef
    console.log(props)
    return(
        <DateRangePicker
            onChange={(dateRange) => {
                // const value = {...columnDef.tableData.filterValue};
                // value.dateRange = dateRange
                console.log('on change')
                console.log(dateRange)
                props.onFilterChanged(columnDef, dateRange);
            }}
            value={props.dateRange}
        />
    )
}
export default dateRangeFilter