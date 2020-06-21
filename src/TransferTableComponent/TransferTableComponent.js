import React, { Component } from 'react';
import MaterialTable from 'material-table';
import config from '../config';
import FilterRow from './m-table-filter-row';
import MTBody from './m-table-body';
import MToolBar from './m-table-toolbar';
import Typography from '@material-ui/core/Typography';
import MTPagination from './m-table-stepped-pagination';
import { createMuiTheme } from '@material-ui/core/styles';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import MTHeader from './m-table-header';
import Paper from '@material-ui/core/Paper'
import Filters from './Filters/Filterbox'



const objColumns = Object.values(config.columns)
let filteredData = []
let numOfRows = 0


const theme = createMuiTheme({
	palette: {
		primary: {
		  main: '#931e1d;',
		},

		secondary: {
		  main: '#931e1d;',
		},
	  },

		typography: {
			color: "#515151",
			fontFamily: "Open Sans",
			fontSize: 14,
			letterSpacing: -0.3,
			width: 66
		},

	  overrides: {
		MuiTableCell: {
			root: {
				textAlign: 'center',
				// padding: 'none'
				padding: 10,
				// width: 66
			},
		},

		MuiSelect: {
			root: {
				color: "#515151",
				fontFamily: "Open Sans",
				fontSize: 14,
				letterSpacing: -0.3,
			}
		},

		MuiTableSortLabel: {
			icon: {
				opacity: 0.3
			}
		},

		MuiTableHead: {
			root: {
				borderWidth: 0,
				borderTopWidth: 2,
				borderBottomWidth: 2,
				borderColor: '#931e1d',
				borderStyle: 'solid',
			}
		}
	  }
})

class TransferTableComponent extends Component {
	state = {
		columns: [],
		data: [],
		filterCountry: '',
		dateRange: null,
		filteredData: null,
		filters: false
	}

	toolbarRef = React.createRef()
	tableRef = React.createRef()
	paginationRef = React.createRef()

	componentDidMount() {
		this.setData()
		this.setFilters()
	}

	componentDidUpdate(prevProps) {
		console.log('reset map: ' + prevProps.resetMap + '=> ' + this.props.resetMap )
		console.log('country' + prevProps.filterCountry + '=> ' + this.props.filterCountry )
		
		if (prevProps.filterCountry !== this.props.filterCountry || 
			 (prevProps.resetMap !== this.props.resetMap)) {
				console.log('update')
			if (this.props.filterCountry !== '') {
				this.filterCountry(this.props.filterCountry)
			}
		}
	}

	setData = () => {
		this.setState({ data: this.props.data, filteredData: [...this.props.data] })
		let newData = this.getLookupData(this.props.data)
		this.initLookup(newData)
		this.loadImage()
	}

	setFilters = () => {
		this.setState({filters: true})
	}

	loadImage = () => {
		objColumns.map(obj => {
			if (obj.type === 'image' && obj.lookup !== '') {
				let keys = Object.keys(obj.lookup)
				keys.map(key => {
					obj.lookup[key] = <img src={obj.lookup[key]} alt={key} />
				})
			}
			else if (obj.type === 'image-link') {
				this.turnImageToLink(obj)
			}
		})
		this.setState({columns: objColumns})
	}

	turnImageToLink = (column) => {
		let dataCopy = [...this.props.data]
		let field = column.field
		let link = column.linkColumn
		console.log(field,link)
		dataCopy.map(row => {
			row[field] = <a href={row[link]}><img src={config.columns[field]["imgLink"][row[field]]} alt={row[field]}/></a>
		})
		this.setState({data: dataCopy})
	}

	
	getLookupData =(data)=> {
	let cols = Object.keys(data[0])
	let newData = cols.reduce((a,b)=> (a[b]={},a),{});
	this.props.data.map(row =>
		{
			cols.map(col => {
				let val = row[col]
				newData[col][val] = val
			})
		})	
		return [newData, cols]
	}

	initLookup =(data)=> {
		let newData = data[0]
		let keys = data[1]

		keys.map(key => {
			objColumns.forEach(col => {
				if (col.field === key && col.lookup === '' && (col.type === '' || col.type === 'numeric')) {
					col.lookup = newData[key]
				}
			})
		})
	}
	
	filterCountry = (country) => {
		objColumns.forEach(col => {
			if (col.field === "country") {
				col.tableData.filterValue = [country]
			}
		})
		this.setState({columns: objColumns})
	}

	resetFilters = () => {
		objColumns.forEach(col => {
			col.tableData.filterValue = ""
		})
		console.log('reset click')
		this.setState({columns: objColumns})
		this.props.handleResetMap()
		this.toolbarRef.current.onSearchChange("");
		this.setState({dateRange: null})
	}

	getFilteredData = () => {
		filteredData = this.tableRef.current.state.data
		let sumOfFilteredData = filteredData.reduce((a, b) => a + parseFloat(b.amount), 0)
		this.paginationRef.current.setSum(sumOfFilteredData);
	}

	getNumOfRowsOnCurrentPage = (value) => {
		numOfRows = value
	}

	handleDateRange = (dateRange) => {
		this.setState({dateRange: dateRange})
	}

	filterAmountRange = (columnDef, data, value) => {
		// there must be a better way to compare
		let	filteredData = [...data]
        if (value.greaterThan !== '' && value.lessThan !== '') {
			filteredData = data.filter(rowData => {
				return parseInt(value.greaterThan) <= parseInt(rowData.amount)
					&& parseInt(value.lessThan) >= parseInt(rowData.amount)
			})
        } else if (value.greaterThan !== '' && value.lessThan === '') {
			filteredData = data.filter(rowData => {
				return parseInt(value.greaterThan) <= parseInt(rowData.amount)
			})
        } else if (value.greaterThan === '' && value.lessThan !== '') {
			filteredData = data.filter(rowData => {
				return parseInt(value.lessThan) >= parseInt(rowData.amount)
			})
		}
		return filteredData
	}

	filterDefault = (columnDef, data, value) => {
		let filteredData = [...data]
		if (value.length > 0) {
			filteredData = data.filter(rowData => {
				return rowData[columnDef.field] === value
			})
		}
		return filteredData
	}

	filterDateRange = (columnDef, data, value) => {
		let filteredData = [...data]
		if (value.dateRange != null) {
			filteredData = data.filter(rowData => {
				const rowDate = new Date(rowData.transactionDate)
				return rowDate >= value.dateRange[0] && rowDate <= value.dateRange[1]
			})
		}
		this.setState({dateRange: value.dateRange})
		return filteredData
	}

	handleFilterChanged = (filterState) => {
		let filteredData = [...this.state.data]
		console.log(filterState)
		for (let key in filterState) {
			let columnDef = objColumns[key]
			let value = filterState[key]
			console.log(value)
			if (value != null) {
				if (objColumns[key].type === 'number_range'){
					console.log('number range ')
					filteredData = this.filterAmountRange(columnDef, filteredData, value)
				} else if (objColumns[key].type === 'date_range'){
					console.log('date range')
					filteredData = this.filterDateRange(columnDef, filteredData, value)
				} else {
					console.log('default')
					filteredData = this.filterDefault(columnDef, filteredData, value)
				}
			}
		}
		this.setState({filteredData: filteredData})	
	}


	render() {
		let filters = null
		if (this.state.filters) {
			filters = <Filters 
				dateRange={this.state.dateRange}
				columns={this.state.columns} 
				onFilterChanged={this.handleFilterChanged}></Filters>
		}
		return (
			<MuiThemeProvider theme={theme}>
				{filters}
				<MaterialTable
					tableRef={this.tableRef}
					onSearchChange={this.getFilteredData}
					onFilterChange={this.getFilteredData}
					columns={this.state.columns}
					data={this.state.filteredData}
					components={{
						// FilterRow: props => <FilterRow {...props} dateRange={this.state.dateRange} dateRangeChange={this.handleDateRange}/>,
						Body: props => <MTBody {...props} resetFilters={this.resetFilters} getFilteredData={this.getFilteredData} getNumOfRowsOnPage={this.getNumOfRowsOnCurrentPage}/>,
						Toolbar: props => (
						<div>
							<Typography variant="" className='explore'>{config.table.textBody}</Typography>
							<MToolBar {...props} ref={this.toolbarRef}/>
						</div>
						),
						Pagination: props => <MTPagination {...props} ref={this.paginationRef} numOfRows={numOfRows} totalNumOfRows={this.state.data.length}/>,
						Header: props => <MTHeader {...props} />,
						Container: props => <Paper {...props} elevation={0}/>
					}}

					icons={{ Search: () => <div /> }} 

					localization={{
						toolbar: { searchPlaceholder: "Search the data…" },
					}}

					options={{
						...config.table,
						rowStyle: (data, index) => {
							if (index % 2 === 0 && !config.table.rowStyle.backgroundColor) {
								return { ...config.table.rowStyle, backgroundColor: "#e5e5e5" }
							}
							else {return {...config.table.rowStyle}}
						},
					}}
				/>
			</MuiThemeProvider>
		)
	}
}

export default TransferTableComponent;