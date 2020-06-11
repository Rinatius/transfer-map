import React, { Component } from 'react'
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Line
} from 'react-simple-maps'

import {
  csv,
  json,
  nest,
  sum,
  extent,
  scaleLinear
} from 'd3'

const { Set } = require('immutable');

const configURL = 'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-map%2Fmap_config.json?alt=media&token=170acf67-7f33-4da3-ba43-e01b6620469a'
const geoUrl = 'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-map%2Fcountries-110m.json?alt=media&token=94f12c4b-592b-46d9-8761-a20a94c09b20'


class TransferMapComponent extends Component {

  config = {};
  countries = Set([]);
  pairs = [];
  capitals = {};
  dataScaler = null;

  state = {
    ready: false,
    conf: {},
    data: [],
    visibleCountries: Set([]),
    visiblePairs: []
  }

  extractCountries = (table) => {
    table.forEach(row => {
      this.countries = this.countries.add(row.from_country)
      this.countries = this.countries.add(row.to_country)
    })
  }

  nestPairs = (data) => {
    return nest()
      .key(d => d.from_country)
      .key(d => d.to_country)
      .rollup(value => {
        return {
          count: value.length,
          total: sum(value, d => d.amount)
        }
    })
      .entries(data)
  }

  showAllHandler = () => this.setState({visibleCountries: this.countries});

  countryClickHandler = (country) => {
    if (this.countries.has(country)) {

      this.setState({
        visibleCountries: Set([country])
      })
    }
  }

  componentDidMount() {
    json(configURL, c => c)
      .then(conf => {
        this.config = conf
        const table = csv(conf.csvUrl, row => {
          return {
            from_country: row[conf.from_country],
            to_country: row[conf.to_country],
            amount: row[conf.amount]
          }
        })
        const capitals = json(conf.capitals, c => c)
        Promise.all([table, capitals])
          .then(data => {
            const [table, capitals] = data
            this.extractCountries(table)
            this.pairs = this.nestPairs(table);
            const totals = []
            this.pairs.forEach(d => d.values.forEach(t => {
              totals.push(t.value.total)
            }))
            console.log(this.pairs)
            this.dataScaler = scaleLinear()
              .domain(extent(totals))
              .range([0.5, 5])
            this.capitals = nest()
              .key(d => d.name)
              .map(capitals)
            console.log(this.capitals)
            this.setState({
              data: table,
              ready: true,
              visibleCountries: this.countries,
              visiblePairs: this.pairs
            })
          })
      })
  }

  render() {

    let all = null;
    if (this.state.ready) {
      all = (
        <div>
          <ComposableMap projectionConfig={{
            scale: 230,
            xOffset: 1000,
            yOffset: 50
          }}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => {
                const c = this.state.visibleCountries.has(geo.properties.name);
                return (
                  <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => this.countryClickHandler(geo.properties.name)}
                  stroke='#FFF'
                  fill={c ? this.config.active_color : this.config.passive_color }/>
                )
              })}
            </Geographies>

            {this.state.visiblePairs.map(fromCountry =>
              fromCountry.values.map(toCountry => {
                //console.log(this.capitals)
                //console.log(this.capitals.get(fromCountry.key))
                console.log(toCountry)
                return <Line
                  from={this.capitals.get(fromCountry.key)[0].latlng.slice().reverse()}
                  to={this.capitals.get(toCountry.key)[0].latlng.slice().reverse()}
                  stroke="#FF5533"
                  strokeWidth={this.dataScaler(toCountry.value.total)}
                  strokeLinecap="round"
                />
            })
            )}
          </ComposableMap>
          <div onClick={this.showAllHandler}>Show All</div>
        </div>
      );
    }
    return(
      <div>
        {all}
      </div>
    )
  }
}

export default TransferMapComponent;