import React, { Component } from 'react'
import AmountRangeFilter from './AmountRangeFilter'
import DefaultFilter from './DefaultFilter'

const filters = (props) => {
    let amountRange = null
    let defaultFilter = null
    if (props.columns.length > 0) {
        amountRange = <AmountRangeFilter columnDef={props.columns[3]} onFilterChanged={(columnId, value) => props.onFilterChanged(columnId, value)}/>
        defaultFilter = <DefaultFilter columnDef={props.columns[5]} onFilterChanged={(columnId, value) => props.onFilterChanged(columnId, value)}/>
    }
    return (
        <div>
            {amountRange}
            {defaultFilter}
        </div>
    )
}

export default filters