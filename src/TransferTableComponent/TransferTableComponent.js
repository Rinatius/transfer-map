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
import MTHeader from './m-table-header'



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
		width: "241px",
		height: "19px",
		color: "#515151",
		fontFamily: "Open Sans",
		fontSize: "14px",
		letterSpacing: "-0.3px",
	  },
	  overrides: {
		MuiTableSortLabel: {
			icon: {
				opacity: 0.3
			}
		}
	  }
})

class TransferTableComponent extends Component {
	state = {
		columns: [],
		data: [],
		filterCountry: '',
	}

	toolbarRef = React.createRef()
	tableRef = React.createRef()
	paginationRef = React.createRef()

	componentDidMount() {
		this.setData()
	}

	componentDidUpdate(prevProps) {
		console.log('reset map: ' + prevProps.resetMap + '=> ' + this.props.resetMap )
		console.log('country' + prevProps.filterCountry + '=> ' + this.props.filterCountry )
		
		if (prevProps.filterCountry !== this.props.filterCountry || 
			 (prevProps.resetMap !== this.props.resetMap)) {
				console.log('update')
			if (this.props.filterCountry !== '') {
				// this.setState({filterCountry: this.props.filterCountry})
				this.filterCountry(this.props.filterCountry)
				// this.
			}
		}
	}

	setData = () => {
		this.setState({ data: this.props.data })
		let newData = this.getLookupData(this.props.data)
		this.initLookup(newData)
		this.loadImage()
	}

	loadImage = () => {
		objColumns.map(obj => {
			if (obj.type === 'image' && obj.lookup !== '') {
				let keys = Object.keys(obj.lookup)
				keys.map(key => {
					obj.lookup[key] = <img src={obj.lookup[key]} alt={key} />
				})
			}
		})
		this.setState({columns: objColumns})
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
	}

	getFilteredData = () => {
		filteredData = this.tableRef.current.state.data
		console.log(this.tableRef.current.state.data)
		let sumOfFilteredData = filteredData.reduce((a, b) => a + parseFloat(b.amount), 0)
		console.log(sumOfFilteredData)
		this.paginationRef.current.setSum(sumOfFilteredData);
	}

	getNumOfRowsOnCurrentPage = (value) => {
		numOfRows = value
	}


	render() {
		return (
			<MuiThemeProvider theme={theme}>
			<MaterialTable
				tableRef={this.tableRef}
				onSearchChange={this.getFilteredData}
				onFilterChange={this.getFilteredData}
				columns={this.state.columns}
				data={this.state.data}
				components={{
					FilterRow: props => <FilterRow {...props}/>,
					Body: props => <MTBody {...props} resetFilters={this.resetFilters} getFilteredData={this.getFilteredData} getNumOfRowsOnPage={this.getNumOfRowsOnCurrentPage}/>,
					Toolbar: props => (
					<div>
						<Typography variant="" className='explore'>{config.table.textBody}</Typography>
						<MToolBar {...props} ref={this.toolbarRef}/>
					</div>
					),
					Pagination: props => <MTPagination {...props} ref={this.paginationRef} numOfRows={numOfRows} totalNumOfRows={this.state.data.length}/>,
					Header: props => <MTHeader {...props} />
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