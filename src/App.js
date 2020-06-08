import React, { Component } from 'react'
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from 'react-simple-maps'

import {
  csv,
  json
} from 'd3'

const { Set } = require('immutable');

const configURL = 'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-map%2Fmap_config.json?alt=media&token=dd4882b0-08e6-4111-b5f1-143019a7a962'
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'


class App extends Component {

  config = {};
  countries = Set([]);

  state = {
    ready: false,
    conf: {},
    data: [],
    visibleCountries: Set([])
  }

  extractCountries = (table) => {
    table.forEach(row => {
      this.countries = this.countries.add(row.from_country)
      this.countries = this.countries.add(row.to_country)
    })
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
    json(configURL, config => config)
      .then(conf => {
        this.config = conf;
        csv(conf.csvUrl, data => {
          return {
            from_country: data[conf.from_country],
            to_country: data[conf.to_country],
            amount: data[conf.amount]
          }
        })
          .then(table => {
            this.extractCountries(table)
            console.log(this.countries)
            this.setState({
              data: table,
              ready: true,
              visibleCountries: this.countries
            })
          })
      })
  }

  render() {

    let all = null;
    if (this.state.ready) {
      all = (
        <div>
          <ComposableMap>
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

export default App;
