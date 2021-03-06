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
import MTable from './src'



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
			fontFamily: "'Open Sans', sans-serif",
			fontSize: 14,
			letterSpacing: -0.3,
			width: 66
		},

	  overrides: {
		MuiTableCell: {
			root: {
				textAlign: 'center',
				padding: 'none',
				width: 20,
			},
			sizeSmall: {
				padding: 'none',
				height: 37,
			}
		},

		MuiMenuItem: {
			root: {
				paddingLeft: '10px',
				fontSize: '13px',
				color: 'black',
			}
		},
		
		MuiFormLabel: {
			root: {
				paddingLeft: '10px',
				fontSize: '13px'
			}
		},

		MuiInputBase: {
			root: {
				fontFamily: "'Open Sans', sans-serif",
				fontSize: 14,
				boxShadow: "0 1px 2px rgba(0, 0, 0, 0.35)",
				borderRadius: "3px",
				border: "1px solid #979797",
			},
			input: {
				  fontSize: '13px',
				  fontFamily: "'Open Sans', sans-serif",
				  color: "#515151",
			  	}
		},

		MuiSelect: {
			root: {
				color: "#515151",
				fontFamily: "'Open Sans', sans-serif",
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
		applyUrlParams: true
	}

	toolbarRef = React.createRef()
	tableRef = React.createRef()
	paginationRef = React.createRef()

	componentDidMount() {
		this.setData()
		// this.setFilters()
	}

	componentDidUpdate(prevProps) {
		if (this.state.applyUrlParams) {
			this.setFilters()
			this.setState({applyUrlParams: false})
		}
		if (prevProps.filterCountry !== this.props.filterCountry || 
			 (prevProps.resetMap !== this.props.resetMap)) {
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
		const keys = Object.keys(config.columns)
		const urlFilters = this.props.urlFilters
		Object.entries(urlFilters).forEach((filter) => {
			const index = keys.findIndex((value) => {return value === filter[0]}) 
			if (objColumns[index].tableData) {
				objColumns[index].tableData.filterValue = [filter[1]]
			}
		})
		this.setState({columns: objColumns})
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
		dataCopy.map(row => {
			if (row[link] === '') {
				row[field] = <img style={{opacity: 0.4}} src={config.columns[field]["imgLink"][row[field]]} alt={row[field]}/>
			}
			else {
				row[field] = <a href={ (config.downloadsPrefix ? config.downloadsPrefix : '') + row[link]}><img src={config.columns[field]["imgLink"][row[field]]} alt={row[field]}/></a>
			}
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
				if (col.field === key && col.lookup === '' && col.type === '') {
					col.lookup = {}
					for (const [k, value] of Object.entries(newData[key])) {
						if (config.table.hideEmptyFilters) {
							if (value.replace(/ /g, '') !== '') {
								col.lookup[k] = value
							}
						}
						else {
							col.lookup[k] = value
						}
					}
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
		this.setState({columns: objColumns})
		this.props.handleResetMap()
		this.toolbarRef.current.onSearchChange("");
		this.setState({dateRange: null})
	}

	getFilteredData = () => {
		filteredData = this.tableRef.current.state.data
		let sumOfFilteredData = filteredData.reduce((a, b) => {
			return b.amount ? a + parseFloat(b.amount) : a;
		}, 0)
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
        if (value.greaterThan != null && value.lessThan != null) {
			filteredData = data.filter(rowData => {
				return parseInt(value.greaterThan) <= parseInt(rowData.amount)
					&& parseInt(value.lessThan) >= parseInt(rowData.amount)
			})
        } else if (value.greaterThan != null && value.lessThan == null) {
			filteredData = data.filter(rowData => {
				return parseInt(value.greaterThan) <= parseInt(rowData.amount)
			})
        } else if (value.greaterThan == null && value.lessThan != null) {
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
				return rowData[columnDef.field] == value
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

	handleFilterChanged = (columnDef, value) => {
		let filteredData = [...this.state.data]
		if (columnDef.type === 'number_range'){
			filteredData = this.filterAmountRange(columnDef, filteredData, value)
		} else if (columnDef.type === 'date_range'){
			filteredData = this.filterDateRange(columnDef, filteredData, value)
		} else {
			filteredData = this.filterDefault(columnDef, filteredData, value)
		}
		this.setState({filteredData: filteredData})	
	}


	render() {
		return (
			<MuiThemeProvider theme={theme}>
			<MTable
				tableRef={this.tableRef}
				onSearchChange={this.getFilteredData}
				onFilterChange={this.getFilteredData}
				columns={this.state.columns}
				data={this.state.data}
				components={{
					FilterRow: props => <FilterRow {...props} dateRange={this.state.dateRange} dateRangeChange={this.handleDateRange} 
					cellStyle={config.table.filterCellStyle} boxStyle={config.table.filterBoxStyle} resetFilters={this.resetFilters}/>,
					Body: props => <MTBody {...props} getFilteredData={this.getFilteredData} getNumOfRowsOnPage={this.getNumOfRowsOnCurrentPage}/>,
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
			/></MuiThemeProvider>
		)
	}
}

export default TransferTableComponent;