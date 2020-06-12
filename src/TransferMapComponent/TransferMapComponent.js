import React, { Component } from 'react'
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Line,
  Marker
} from 'react-simple-maps'

import {
  csv,
  json,
  nest,
  sum,
  extent,
  scaleLinear
} from 'd3'

import config from '../config';

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
    visiblePairs: [],
    focusCountry: null
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
        focusCountry: country
      })
      this.props.handleCountryClick(country)
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.resetMap !== this.props.resetMap && this.props.resetMap) {
      this.setState({focusCountry: null})
    }

  }

  componentDidMount() {
    json(config.mapOptions.capitals, c => c)
      .then(capitals => {
        const table = this.props.data.map(row => {
          return {
            from_country: row[config.columns.fromCountry.field],
            to_country: row[config.columns.country.field],
            amount: row[config.columns.amount.field]
          }
        })
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
          }}
          handleCountryClick={this.handleCountryClick}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const c = this.state.visibleCountries.has(geo.properties.name);
                  const focusCountry = (this.state.focusCountry === geo.properties.name);
                  let countryFill = config.mapOptions.passive_color;
                  if (focusCountry) {
                    countryFill = config.mapOptions.focus_color
                  } else if (c) {
                    countryFill = config.mapOptions.active_color
                  };
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => this.countryClickHandler(geo.properties.name)}
                    stroke='#FFF'
                    fill={countryFill}
                  />
                )
              })}
            </Geographies>
           
            {this.state.visiblePairs.map(fromCountry =>
              fromCountry.values.map(toCountry => {
                //console.log(this.capitals)
                //console.log(this.capitals.get(fromCountry.key))
                // console.log(toCountry)
                return <Line
                  //line={{ coordinates: { start: this.capitals.get(fromCountry.key)[0].latlng.slice().reverse(), end: this.capitals.get(toCountry.key)[0].latlng.slice().reverse() }, curveStyle: "forceUp" }}
                  from={this.capitals.get(fromCountry.key)[0].latlng.slice().reverse()}
                  to={this.capitals.get(toCountry.key)[0].latlng.slice().reverse()}
                  preserveMarkerAspect={false}
                  stroke="#931e1d"
                  strokeWidth={this.dataScaler(toCountry.value.total)}
                  strokeLinecap="round"
                />
            })
            )}
            {this.state.visiblePairs.map(fromCountry =>
              fromCountry.values.map(toCountry => {
                return <Marker
                  coordinates={this.capitals.get(toCountry.key)[0].latlng.slice().reverse()}
                >

                  <defs>
                    <mask id="k4zgb" width="2" height="2" x="-1" y="-1">
                      <path fill="#fff" d="M2 1h104v39H2z"/>
                      <path d="M2 1h104v34H59l-5 5-5-5H2z"/>
                    </mask>
                    <filter id="k4zga" width="128" height="64" x="-10" y="-11" filterUnits="userSpaceOnUse">
                      <feOffset dy="1" in="SourceGraphic" result="FeOffset1023Out"/>
                      <feGaussianBlur in="FeOffset1023Out" result="FeGaussianBlur1024Out" stdDeviation="0.8 0.8"/>
                    </filter>
                    <clipPath id="k4zgc">
                      <path fill="#fff" d="M2 1h104v34H59l-5 5-5-5H2z"/>
                    </clipPath>
                  </defs>
                  <g
                    transform="translate(-53, -45)"
                  >
                    <g>
                      <g filter="url(#k4zga)">
                        <path fill="none" d="M2 1h104v34H59l-5 5-5-5H2z" mask="url(&quot;#k4zgb&quot;)"/>
                        <path fill-opacity=".35" d="M2 1h104v34H59l-5 5-5-5H2z"/>
                      </g>
                      <path fill="#931e1d" d="M2 1h104v34H59l-5 5-5-5H2z"/>
                      <path fill="none" stroke="#fff" stroke-miterlimit="20" stroke-width="2"
                            d="M2 1h104v34H59l-5 5-5-5H2z" clip-path="url(&quot;#k4zgc&quot;)"/>
                    </g>
                  </g>

                  <text
                    textAnchor="middle"
                     y={-30}
                    style={{
                      color: '#ffffff',
                      font_family: 'Open Sans',
                      font_size: '12px',
                      font_weight: 700,
                      letter_spacing: '-0.26px'
                    }}
                  >
                    {('$' + toCountry.value.total + '\n')}
                  </text>
                  <text
                    textAnchor="middle"
                    y={-15}
                    style={{
                      color: '#ffffff',
                      font_family: 'Open Sans',
                      font_size: '10px',
                      font_weight: 700,
                      letter_spacing: '-0.26px'
                    }}
                  >
                    {(toCountry.value.count + ' ' + 'transactions')}
                  </text>
                </Marker>

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