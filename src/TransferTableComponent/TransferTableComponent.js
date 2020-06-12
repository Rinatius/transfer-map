import React, { Component } from 'react';
import MaterialTable from 'material-table';
import config from '../config';
import { csv } from 'd3';
import FilterRow from './m-table-filter-row'
import MTBody from './m-table-body'


const objColumns = Object.values(config.columns)

const csvUrl = config.csvUrl



class TransferTableComponent extends Component {
	state = {
		columns: [],
		data: []
	}

	componentDidMount() {
		this.setData()
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
				obj.cellStyle = { textAlign: 'center' }
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


	resetFilters = () => {
		objColumns.forEach(col => {
			col.tableData.filterValue = ""
		})
		this.setState({columns: objColumns})
	}

	


	render() {
		return (
			<MaterialTable
				columns={this.state.columns}
				data={this.state.data}

				components={{
					FilterRow: props => <FilterRow {...props} />,
					Body: props => <MTBody {...props} resetFilters={this.resetFilters}/>
				}}

				localization={{
					toolbar: { searchPlaceholder: "Search the data…" },
				}}

				options={{
					headerStyle: {
						borderWidth: 0,
						borderTopWidth: 2,
						borderBottomWidth: 2,
						borderColor: '#931e1d',
						borderStyle: 'solid',
					},
					pageSize: 20,
					hideFilterIcons: true,
					showTitle: false,
					filtering: true,
					pageSizeOptions: [],
					paginationType: 'stepped',
					padding: 'dense',
					searchFieldAlignment: 'left',
					// searchFieldStyle: {
					//                   width: '100%',
					//                   height: '35px',
					//                   boxShadow: 'inset 1px 2px 4px rgba(0, 0, 0, 0.35)',
					//                   border: '1px solid #979797',
					//                   backgroundColor: '#ffffff'},
					rowStyle: (data, index) => {
						if (index % 2 === 0) {
							return { backgroundColor: "#e5e5e5" }
						}
					},
				}}
			/>
		)
	}
}

export default TransferTableComponent;