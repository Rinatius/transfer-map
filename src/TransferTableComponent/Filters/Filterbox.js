import React, { Component } from 'react'
import AmountRangeFilter from './AmountRangeFilter'
import DefaultFilter from './DefaultFilter'
import DateRangeFilter from './DateRangeFilter'

class Filterbox extends Component {
    filterComponents = []
    filterState = {} 
    updateFilterValues(columnDef, value) {
        console.log(columnDef)
        console.log(value)
        this.filterState[columnDef.tableData.id] = value
        console.log(this.filterState)
        this.props.onFilterChanged(this.filterState)
    }
    componentDidMount(){
        if (this.props.columns.length > 0) {
            const columns = this.props.columns.filter(column => {return column.filtering})
            columns.forEach(column => {
                if (column.type === 'number_range') {
                    this.filterComponents.push(<AmountRangeFilter 
                        columnDef={column} 
                        onFilterChanged={(columnDef, value) => this.updateFilterValues(columnDef, value)}/>)
                } else if (column.type === 'date_range') {
                    this.filterComponents.push(<DateRangeFilter 
                        dateRange={this.props.dateRange}
                        columnDef={column} 
                        onFilterChanged={(columnDef, value) => this.updateFilterValues(columnDef, value)}/>)
                } else {
                    this.filterComponents.push(<DefaultFilter 
                        columnDef={column} 
                        onFilterChanged={(columnDef, value) => this.updateFilterValues(columnDef, value)}/>)
                }
            })
            console.log(this.filterComponents)
        }

    }
    render() {
        return(
            this.filterComponents
        )
    }
}

export default Filterbox