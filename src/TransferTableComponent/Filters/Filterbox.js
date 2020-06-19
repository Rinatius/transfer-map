import React, { Component } from 'react'
import AmountRangeFilter from './AmountRangeFilter'
import DefaultFilter from './DefaultFilter'
import DateRangeFilter from './DateRangeFilter'

const filters = (props) => {
    let filters = []
    if (props.columns.length > 0) {
        const columns = props.columns.filter(column => {return column.filtering})
        columns.forEach(column => {
            if (column.type === 'number_range') {
                filters.push(<AmountRangeFilter 
                    columnDef={column} 
                    onFilterChanged={(columnDef, value) => props.onFilterChanged(columnDef, value)}/>)
            } else if (column.type === 'date_range') {
                filters.push(<DateRangeFilter 
                    dateRange={props.dateRange}
                    columnDef={column} 
                    onFilterChanged={(columnDef, value) => props.onFilterChanged(columnDef, value)}/>)
            } else {
                filters.push(<DefaultFilter 
                    columnDef={column} 
                    onFilterChanged={(columnDef, value) => props.onFilterChanged(columnDef, value)}/>)
            }
        })
    }
    return (
        filters
    )
}

export default filters