import React, { Component } from 'react'
import { Button } from '@material-ui/core';
import AmountRangeFilter from './AmountRangeFilter'
import DefaultFilter from './DefaultFilter'
import DateRangeFilter from './DateRangeFilter'
import cloneDeep from 'lodash/cloneDeep';
import * as _ from 'lodash';
import config from '../../config';

class Filterbox extends Component {
    state = {
        filterState: {} 
    }
    filterComponents = []
    updateFilterValues(columnDef, value) {
        let filterState = cloneDeep(this.state.filterState)
        filterState[columnDef] = value
        console.log(filterState)
        this.setState({filterState: filterState})
        this.props.onFilterChanged(filterState)
    }
    // resetFilterValues() {
    //     this.setState({filterState: {}})
    // }

    render() {
        console.log(this.props.columns)
        if (Object.keys(this.props.columns).length > 0) {
            let columnsToFilter = []
            Object.entries(this.props.columns).forEach(([key, value]) => {
                if (value.filtering) {
                    columnsToFilter.push(key)
                }
            });
            // const columns = this.props.columns.filter(column => {return column.filtering})
            this.filterComponents = []
            // let filterComponents = [...this.state.filterComponents]
            console.log(Object.keys(columnsToFilter))
            columnsToFilter.forEach(column => {
                console.log(config.columns)
                if (this.props.columns[column].type === 'number_range') {
                    this.filterComponents.push(<AmountRangeFilter 
                        columnDef={config.columns[column]} 
                        value={this.state.filterState[column]}
                        configKey={column}
                        onFilterChanged={(columnDef, value) => this.updateFilterValues(columnDef, value)}/>)
                } else if (this.props.columns[column].type === 'date_range') {
                    this.filterComponents.push(<DateRangeFilter 
                        dateRange={this.props.dateRange}
                        columnDef={config.columns[column]} 
                        configKey={column}
                        onFilterChanged={(columnDef, value) => this.updateFilterValues(columnDef, value)}/>)
                } else {
                    this.filterComponents.push(<DefaultFilter 
                        columnDef={config.columns[column]} 
                        value={this.state.filterState[column]}
                        configKey={column}
                        onFilterChanged={(columnDef, value) => this.updateFilterValues(columnDef, value)}/>)
                }

            })

            this.filterComponents.push(<Button onClick={() => {
                console.log('reset')
                const emptyKeys = {}
                columnsToFilter.forEach(key => {
                    // if (key === 'amount')
                    emptyKeys[key] = ''
                }) 
                console.log(emptyKeys)
                this.setState({filterState: emptyKeys})
                // this.resetFilterValues()
                this.props.onResetClicked(emptyKeys)
            }}>Reset all filters</Button>)
            // this.setState({filterComponents: filterComponents})
        }
        return(
            this.filterComponents
        )
    }
}

export default Filterbox