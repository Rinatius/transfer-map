import React, { Component } from 'react';

import TransferMapComponent from "./TransferMapComponent/TransferMapComponent";
import TransferTableComponent from "./TransferTableComponent/TransferTableComponent";
import config from "./config";
import {csv} from "d3";


class App extends Component {
  state = {
    ready: false,
    data: {},
    filterCountry: '',
    resetMap: false
  }

  componentDidMount() {
    csv(config.csvUrl)
      .then(d => this.setState({data: d, ready: true}))
  }
  
  handleCountryClick = (country) => {
    this.setState({filterCountry: country,
                   resetMap: false})
  }
  handleResetMap = () => {
    this.setState({resetMap: true})
  }

  render() {
    let all = null;
    if (this.state.ready) {
      all = (
        <div>
          <TransferMapComponent 
            data={this.state.data}
            handleCountryClick={this.handleCountryClick}
            resetMap={this.state.resetMap} />
          <TransferTableComponent 
            data={this.state.data}
            filterCountry={this.state.filterCountry}
            resetMap={this.handleResetMap} />
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
