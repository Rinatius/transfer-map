import React, { Component } from 'react';

import TransferMapComponent from "./TransferMapComponent/TransferMapComponent";
import TransferTableComponent from "./TransferTableComponent/TransferTableComponent";
import Legend from './Legend/Legend'
import config from "./config";
import {csv} from "d3";

import './styles.css'


class App extends Component {
  state = {
    ready: false,
    data: {},
    filterCountry: '',
    urlFilters: '',
    resetMap: false
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    this.setState({urlFilters: urlParams});
    csv(config.csvUrl)
      .then(d => this.setState({data: d, ready: true}))
  }
  
  handleCountryClick = (country) => {
    this.setState({filterCountry: country,
                   resetMap: false})
  }
  handleResetMap = () => {
    this.setState({resetMap: true,
                   filterCountry: ''})
  }

  render() {
    let all = null;
    if (this.state.ready) {
      all = (
        <div class="main">
          <TransferMapComponent 
            data={this.state.data}
            handleCountryClick={this.handleCountryClick}
            resetMap={this.state.resetMap} />
          <TransferTableComponent 
            data={this.state.data}
            filterCountry={this.state.filterCountry}
            resetMap={this.state.resetMap}
            handleResetMap={this.handleResetMap} />
          <Legend />
        </div>
      );
    }
    return (
      <div className="App">
        {all}
      </div>
    );
  }
}

export default App;
