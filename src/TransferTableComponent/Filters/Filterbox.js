import React, { Component } from 'react'
import AmountRangeFilter from './AmountRangeFilter'
import DefaultFilter from './DefaultFilter'
import DateRangeFilter from './DateRangeFilter'
import Box from '@material-ui/core/Box'

const filters = (props) => {
    let filters = []
    if (props.columns.length > 0) {
        const columns = props.columns.filter(column => {return column.filtering})
        columns.forEach(column => {
            if (column.type === 'number_range') {
                filters.push(
                <Box item style={props.boxStyle}>
                    <AmountRangeFilter 
                        style={props.cellStyle}
                        columnDef={column} 
                        onFilterChanged={(columnDef, value) => props.onFilterChanged(columnDef, value)}/>
                </Box>)
            } else if (column.type === 'date_range') {
                filters.push(
                <Box item style={props.boxStyle}>
                    <DateRangeFilter 
                    style={props.cellStyle}
                    dateRange={props.dateRange}
                    columnDef={column} 
                    onFilterChanged={(columnDef, value) => props.onFilterChanged(columnDef, value)}/>
                </Box>)
            } else {
                filters.push(
                <Box item style={props.boxStyle}>
                    <DefaultFilter 
                    style={props.cellStyle}
                    columnDef={column} 
                    onFilterChanged={(columnDef, value) => props.onFilterChanged(columnDef, value)}/>
                </Box>)
            }
        })
    }
    return (
        <Box container display="flex" justifyContent="left" m={0} p={0} >
        {filters}
        </Box>
    )
}

export default filters