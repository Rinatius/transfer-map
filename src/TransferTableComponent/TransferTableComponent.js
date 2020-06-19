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
import Filters from './Filters/Filters'



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
		dataCopy.map(col => {
			col[field] = <a href={col[link]}><img src={config.columns[field]["imgLink"][col[field]]} alt={col[field]}/></a>
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

	handleFilterChanged = (columnId, value) => {
		console.log('columnId: ' + columnId)
		console.log(value)
		const data = [...this.state.data]
		this.setState({filteredData: data})
		if (value.greaterThan.length === 0){
			this.setState({filteredData: [...data]})
		}
		if (value.greaterThan.length !== 0){
		}
		let filteredData = data.filter(rowData => {
				return parseInt(rowData.amount) > parseInt(value.greaterThan)

		})
		console.log(this.state.columns[columnId])
		console.log(this.state.data)
		// objColumns[columnId].tableData.customFilterAndSearch = (term, rowData) => { return rowData.amount > value.greaterThan }
		// objColumns.forEach(col => {
		// 	if (col.field === "country") {
		// 		col.tableData.filterValue = [country]
		// 	}
		// })
		this.setState({filteredData: filteredData})	
	}


	render() {
		let filters = null
		if (this.state.filters) {
			filters = <Filters columns={this.state.columns} onFilterChanged={this.handleFilterChanged}></Filters>
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