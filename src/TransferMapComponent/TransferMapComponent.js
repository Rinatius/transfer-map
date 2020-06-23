import React, { Component } from 'react'
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Line,
  Marker,
  Annotation
} from 'react-simple-maps'


import {
  csv,
  json,
  nest,
  sum,
  extent,
  scaleLinear,
  line,
  curveBasis
} from 'd3'

import * as d3Geo from "d3-geo"

import config from '../config';

const { Set } = require('immutable');

//const configURL = 'https://firebasestorage.googleapis.com/v0/b/newagent-b0720.appspot.com/o/transfer-map%2Fmap_config.json?alt=media&token=170acf67-7f33-4da3-ba43-e01b6620469a'
const geoUrl = config.mapOptions.geoUrl

const { geoPath, ...projections } = d3Geo

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

  countryClickHandler = (country) => {
    console.log('country click')
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
          .range([1, 5])
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
      const proj = projections["geoEqualEarth"]().rotate([-40, 0]).scale(180)
      all = (
        <div style={{
          borderTop: '2px solid #931e1d',
          paddingTop: '25px',
        }}>
          <ComposableMap projection={proj}
                         width={900}
                         height={500}
                         onClick={this.handleCountryClick}>
            <Geographies geography={geoUrl}>
              {({geographies}) =>
                geographies.map(geo => {
                  const c = this.state.visibleCountries.has(geo.properties.name);
                  const focusCountry = (this.state.focusCountry === geo.properties.name);
                  let countryFill = config.mapOptions.passive_color;
                  let hover = {outline: "none"};
                  if (focusCountry) {
                    countryFill = config.mapOptions.focus_color
                  } else if (c) {
                    countryFill = config.mapOptions.active_color
                    hover = {outline: "none", cursor: "pointer"}
                  }
                  ;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => this.countryClickHandler(geo.properties.name)}
                      stroke='#FFF'
                      fill={countryFill}
                      style={{
                        default: {outline: "none"},
                        hover: hover,
                        pressed: {outline: "none"},
                      }}
                    />
                  )
                })}
            </Geographies>

            {this.state.visiblePairs.map(fromCountry =>
              fromCountry.values.map(toCountry => {
                let x = this.capitals.get(toCountry.key)[0].latlng.slice().reverse()[0] - 2
                let y = this.capitals.get(toCountry.key)[0].latlng.slice().reverse()[1] + 0.5
                return <Marker

                  coordinates={[x, y]}>
                  <g transform="translate(-2, -3)">
                    <g>
                      <image width="17" height="11" transform="translate(-1)"
                             href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAALCAYAAACZIGYHAAABAklEQVQoU63SOUtEQRAE4G+9bxA8MBHFTM0EM03M/MGGBpoZmKiZgZiIGggeKK4Xtcw8HrKJYEPTPQNVXV0zHf8QnT4cuRtoZc7fJT/xVfoG2iZJP4IJTJYcxxA+8IqXVnYrWSVJDWABq1gu/QyGEcAjbnGNq9K/haiSZFoItrCDdcwXNYNlhWfc4QLHOMV9VFaSTMv0PexjE7NlvfgTH97xgDMc4LCo6raVLGIbu9jAXPEnSmJoPMnkcxzhpChrlIQshi5hDStlnemWsXWd+HGJm0LceJLnCtFo8SHgKYyhKomJIXoqNevl6XvA35G7AONFav0n9Y+k9sA1+pH8+Q//AP87QAx5oVJdAAAAAElFTkSuQmCC"/>
                    </g>
                    <g>
                      <path fill="#fff"
                            d="M12.122 4.664c0 1.035-2.12 1.874-4.735 1.874-2.616 0-4.737-.839-4.737-1.874 0-1.035 2.121-1.874 4.737-1.874 2.615 0 4.735.839 4.735 1.874"/>
                    </g>
                    <g>
                      <path fill="none" stroke="#666" stroke-miterlimit="20" stroke-width=".25"
                            d="M12.122 4.664c0 1.035-2.12 1.874-4.735 1.874-2.616 0-4.737-.839-4.737-1.874 0-1.035 2.121-1.874 4.737-1.874 2.615 0 4.735.839 4.735 1.874z"/>
                    </g>
                  </g>
                </Marker>

              })
            )}

            {this.state.visiblePairs.map(fromCountry =>
              fromCountry.values.map(toCountry => {
                const from = this.capitals.get(fromCountry.key)[0].latlng.slice().reverse()
                const to = this.capitals.get(toCountry.key)[0].latlng.slice().reverse()
                const fromAbs = proj(from)
                const toAbs = proj(to)
                const dx = toAbs[0] - fromAbs[0]
                const dy = toAbs[1] - fromAbs[1]
                const connectorProps = {
                  stroke: "#931e1d",
                  strokeWidth: this.dataScaler(toCountry.value.total),
                  strokeLinecap: "butt",
                  markerStart: "url(#triangle)"
                }
                //const connectorPath = `M${0}, ${0} l${-dx},${-dy}`
                return <Annotation
                  subject={from}
                  dx={dx}
                  dy={dy}
                  connectorProps={connectorProps}
                >
                  {/*<path d={connectorPath} {...connectorProps}/>*/}

                  <defs>

                    <marker id="triangle" viewBox="0 0 10 10"
                            refX="3" refY="5"
                            markerUnits="strokeWidth"
                            markerWidth="2.5" markerHeight="5"
                            orient="auto">
                      <path d="M 10 0 L 10 10 L 0 5 z" fill="#931e1d"/>
                    </marker>
                  </defs>
                </Annotation>
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
                    transform="translate(-54, -45)"
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
                    style={config.mapOptions.label_text_style}
                  >
                    {('$' + toCountry.value.total.toLocaleString(('en-US')) + '\n')}
                  </text>
                  <text
                    textAnchor="middle"
                    y={-15}
                    style={config.mapOptions.label_text_style}
                  >
                    {(toCountry.value.count + ' ' + 'transactions')}
                  </text>
                </Marker>

              })
            )}
          </ComposableMap>
        </div>
      );
    }
    return (
      <div>
        {all}
      </div>
    )
  }
}

export default TransferMapComponent;