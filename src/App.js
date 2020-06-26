import React, { Component } from 'react';

import TransferMapComponent from "./TransferMapComponent/TransferMapComponent";
import TransferTableComponent from "./TransferTableComponent/TransferTableComponent";
import Legend from './Legend/Legend'
import config from "./config";
import {csv} from "d3";
import queryString from 'query-string'

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
    this.setState({urlFilters: queryString.parse(window.location.search)}) 
    csv(config.csvUrl)
	  .then(d => this.setState({data: d, ready: true}))
    this.resizeIframe();
    window.addEventListener('resize', this.resizeIframe);
  }
  
  handleCountryClick = (country) => {
    this.setState({filterCountry: country,
                   resetMap: false})
  }
  handleResetMap = () => {
    this.setState({resetMap: true,
                   filterCountry: ''})
  }
  resizeIframe = () => {
    window.requestAnimationFrame(function(){
      let height = document.body.scrollHeight + 30;
      console.log('Resize '+height);
      window.parent.postMessage('OCCRP_IFRAME_SET_HEIGHT: '+height, '*');
    });
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
            urlFilters={this.state.urlFilters}
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
