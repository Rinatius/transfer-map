import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MaterialTable from 'material-table';
import config from '../DoJSON';
import { csv, nest, csvParse } from 'd3';
// import { ReactComponent as Icon} from '';
import FilterRow from './m-table-filter-row'


const objColumns = Object.values(config.columns)

const csvUrl = config.csvUrl



class TransferTableComponent extends Component {

	state = {
		columns: [],
		data: []
	}
	tmpData = []
	
	

	componentDidMount() {
		this.setData()
		this.loadImage()
		
	}

	setData = () => {
		csv(csvUrl, data => this.tmpData.push(data))
			.then(() => 
			{
				this.setState({ data: this.tmpData })
				let newData = this.getLookupData(this.state.data)	
				this.initLookup(newData)
			})
	}

	loadImage = () => {
		objColumns.map(obj => {
			if (obj.lookup !== '') {
				let keys = Object.keys(obj.lookup)
				keys.map(key => {
					obj.lookup[key] = <img src={obj.lookup[key]} alt={key} />
				})
				obj.cellStyle = { textAlign: 'center' }
			}
		})
	}

	
	getLookupData =(data)=> {
	let cols = Object.keys(data[0])
	let newData = cols.reduce((a,b)=> (a[b]={},a),{});
	this.tmpData.map(row => 
		{
			cols.map(col => {
				let val = row[col]
				newData[col][val] = val
			})
		})	
		// console.log(newData)
		return [newData, cols]
	}

	initLookup =(data)=> {
		let newData = data[0]
		let keys = data[1]

		keys.map(key => {
			objColumns.forEach(col => {
				if (col.field === key && col.lookup === '' && col.type === '') {
					col.lookup = newData[key]
					// console.log(col.lookup)
				}
			})
		})
		// console.log(objColumns)
		this.setState({columns: objColumns})
	}

	


	render() {
		return (
			<MaterialTable
				// columns={[
				//   objJSON.column1,
				//   objJSON.column2,
				//   // { title: 'Surname', field: 'surname', grouping:true, filtering: true },
				//   { title: 'Birth Year', field: 'birthYear', type: 'date', filtering: true },
				//   { title: 'Birth City', field: 'birthCity', lookup: { confirmed: <DoneIcon/>, unconfirmed: 'Şanlıurfa' } }
				// ]}
				columns={this.state.columns}
				// data={[{ transactionDate: '02-10-2020', paidBy: 'Baran', paidTo: 'James', amount: '10000', country: 'Russia', purpose:'Transfer', type:'Bank', bankSender:'Citibank', confidence:'confirmed', proof:'internal' },
				// { transactionDate: '02-10-2020', paidBy: 'Baran', paidTo: 'James', amount: '10000', country: 'Russia', purpose:'Transfer', type:'Bank', bankSender:'Citibank', confidence:'', proof:'internal' }]}
				data={this.state.data}

				components={{
					FilterRow: props => <FilterRow {...props} />
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