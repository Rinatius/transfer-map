import React, {Component} from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
  ZoomableGroup
} from 'react-simple-maps'


import {
  json,
  nest,
  sum,
  extent,
  scaleLinear
} from 'd3'

import * as d3Geo from "d3-geo"

import config from '../config';

const {Set} = require('immutable');

const geoUrl = config.mapOptions.geoUrl

const {geoPath, ...projections} = d3Geo

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
    focusCountry: null,
    showArrows: false,
    zoom: 1,
    coordinates: [20, 3]
  }

  extractCountries = (table) => {
    table.forEach(row => {
      this.countries = this.countries.add(row.from_country)
      this.countries = this.countries.add(row.to_country)
    })
  }

  // How it used to be
  // nestPairs = (data) => {
  //   return nest()
  //     .key(d => d.from_country)
  //     .key(d => d.to_country)
  //     .rollup(value => {
  //       return {
  //         count: value.length,
  //         total: sum(value, d => d.amount)
  //       }
  //     })
  //     .entries(data)
  // }

  nestPairs = (data) => {
    return nest()
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
	this.props.handleComponentUpdate();
  }

  handlePopupClick(el) {
    let parent = el.currentTarget.parentNode;
    parent.appendChild(el.currentTarget);
  }

  componentDidMount() {
    this.setState({showArrows: config.mapOptions.showArrows})
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

        // How it used to be
        // this.pairs.forEach(d => d.values.forEach(t => {
        //   totals.push(t.value.total)
        // }))

        this.pairs.forEach(t => {
          totals.push(t.value.total)
        })
        this.dataScaler = scaleLinear()
          .domain(extent(totals))
          .range([1, 5])
        this.capitals = nest()
          .key(d => d.name)
          .map(capitals)
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
      const proj = projections["geoEqualEarth"]().rotate([-25, 0, 0]).scale(245).translate([500, 335])
      let counterScale = 1 / this.state.zoom;
      let arrows = null
      if (this.state.showArrows) {
        arrows = this.state.visiblePairs.map(fromCountry =>
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
        )
      }
      all = (
        <div style={{
          borderTop: '2px solid #931e1d',
          paddingTop: '25px'
        }}>
          <ComposableMap projection={proj}
                         width={config.mapOptions.width}
                         height={config.mapOptions.height}
                         onClick={this.handleCountryClick}>
            <ZoomableGroup zoom={this.state.zoom} center={this.state.coordinates} onMoveEnd={this.handleMoveEnd}>
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

              {/* How code below started with */}
              {/* {this.state.visiblePairs.map(fromCountry =>
                fromCountry.values.map(toCountry => {
                  let x, y; */}

              {this.state.visiblePairs.map(toCountry => {
                  let x, y;
                  if (this.capitals.get(toCountry.key)) {

                    x = this.capitals.get(toCountry.key)[0].latlng.slice().reverse()[0]
                    y = this.capitals.get(toCountry.key)[0].latlng.slice().reverse()[1]
                    return <Marker coordinates={[x, y]}>
                      <g transform={`scale(${counterScale} ${counterScale})`}>
                        <g transform="translate(-9, -5)">
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
                      </g>
                    </Marker>
                  }

                })
              }
              {arrows}

              {/* How code below started with */}
              {/* {this.state.visiblePairs.map(fromCountry =>
                fromCountry.values.map(toCountry => {
                  let coords; */}

              {this.state.visiblePairs.map(toCountry => {
                  let coords;
                  if (this.capitals.get(toCountry.key)) {
                    coords = this.capitals.get(toCountry.key)[0].latlng.slice().reverse();

                    return <Marker
                      coordinates={this.capitals.get(toCountry.key)[0].latlng.slice().reverse()}
                      class="rsm-marker rsm-marker--box"
                      onMouseEnter={this.handlePopupClick.bind(this)}
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
                        transform={`scale(${counterScale} ${counterScale})`}
                      >
                        <g
                          transform="translate(-56, -45)"
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
                          y={-32}
                          x={-3}
                          style={config.mapOptions.label_text_style}
                        >
                          {('$' + toCountry.value.total.toLocaleString(('en-US')) + '\n')}
                        </text>
                        <text
                          textAnchor="middle"
                          y={-15}
                          x={-3}
                          style={config.mapOptions.label_text_style}
                        >
                          {toCountry.key}
                        </text>
                      </g>
                    </Marker>
                  }
                })
              }
            </ZoomableGroup>
          </ComposableMap>
          <div className="controls">
            <button onClick={this.handleZoomIn}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
            <button onClick={this.handleZoomOut}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      );
    }
    return (
      <div>
        {all}
      </div>
    )
  }

  handleZoomIn = () => {
    if (this.state.zoom >= 4) return;
    this.setState({zoom: this.state.zoom * 2})
  }

  handleZoomOut = () => {
    if (this.state.zoom <= 1) return;
    this.setState({zoom: this.state.zoom / 2})
  }

  handleMoveEnd = (event) => {
    console.log(event.zoom)
    this.setState({
      zoom: event.zoom,
      coordinates: event.coordinates
    })
  }
}

export default TransferMapComponent;