import React, { Component } from 'react';
import MaterialTable from 'material-table';
import config from '../config';
import FilterRow from './m-table-filter-row'
import MTBody from './m-table-body'


const objColumns = Object.values(config.columns)


class TransferTableComponent extends Component {
	state = {
		columns: [],
		data: []
	}

	componentDidMount() {
		this.setData()
	}

	componentDidUpdate(prevProps) {
		if (prevProps.filterCountry !== this.props.filterCountry) {
			if (this.props.filterCountry !== '') {
				this.filterCountry(this.props.filterCountry)
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
			console.log(col.tableData)
		})
		this.setState({columns: objColumns})
	}

	


	render() {
		return (
			<MaterialTable
				columns={this.state.columns}
				data={this.state.data}
				components={{
				FilterRow: props => {
					return	<FilterRow {...props}/>},
					Body: props => <MTBody {...props} resetFilters={this.resetFilters}/>
				}}

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
		)
	}
}

export default TransferTableComponent;