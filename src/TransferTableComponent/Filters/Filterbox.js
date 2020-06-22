import React, { Component } from 'react'
import { Button } from '@material-ui/core';
import AmountRangeFilter from './AmountRangeFilter'
import DefaultFilter from './DefaultFilter'
import DateRangeFilter from './DateRangeFilter'
import cloneDeep from 'lodash/cloneDeep';

class Filterbox extends Component {
    state = {
        filterState: {} 
    }
    filterComponents = []
    updateFilterValues(columnDef, value) {
        console.log(columnDef)
        console.log(value)
        let filterState = cloneDeep(this.state.filterState)
        filterState[columnDef.tableData.id] = value
        this.setState({filterState: filterState})
        this.props.onFilterChanged(filterState)
    }
    resetFilterValues() {
        this.setState({filterState: {}})
    }

    render() {
        if (this.props.columns.length > 0) {
            const columns = this.props.columns.filter(column => {return column.filtering})
            this.filterComponents = []
            // let filterComponents = [...this.state.filterComponents]
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
            this.filterComponents.push(<Button onClick={() => {
                this.resetFilterValues()
                this.props.onResetClicked({})
            }}>Reset all filters</Button>)
            // this.setState({filterComponents: filterComponents})
            console.log(this.filterComponents)
        }
        return(
            this.filterComponents
        )
    }
}

export default Filterbox