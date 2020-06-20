import React, { Component } from 'react'
import AmountRangeFilter from './AmountRangeFilter'
import DefaultFilter from './DefaultFilter'
import DateRangeFilter from './DateRangeFilter'

class Filterbox extends Component {
    state = {
        filters: [] 
    }
    // componentDidUpdate(prevProps) {
    //     if (prevProps.columns !== this.props.columns) {

    //     }
    // }
    render() {
        if (this.props.columns.length > 0) {
            const columns = this.props.columns.filter(column => {return column.filtering})
            columns.forEach(column => {
                let filters = [...this.state.filters]
                console.log(filters)
                if (column.type === 'number_range') {
                    filters.push(<AmountRangeFilter 
                        columnDef={column} 
                        onFilterChanged={(columnDef, value) => this.props.onFilterChanged(columnDef, value)}/>)
                } else if (column.type === 'date_range') {
                    filters.push(<DateRangeFilter 
                        dateRange={this.props.dateRange}
                        columnDef={column} 
                        onFilterChanged={(columnDef, value) => this.props.onFilterChanged(columnDef, value)}/>)
                } else {
                    filters.push(<DefaultFilter 
                        columnDef={column} 
                        onFilterChanged={(columnDef, value) => this.props.onFilterChanged(columnDef, value)}/>)
                }
                this.setState({filters: filters})
            })
        }
        return(
            this.state.filters
        )
    }
}

export default Filterbox