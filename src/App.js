import React, { Component } from 'react';

import TransferMapComponent from "./TransferMapComponent/TransferMapComponent";
import TransferTableComponent from "./TransferTableComponent/TransferTableComponent";
import config from "./config";
import {csv} from "d3";


class App extends Component {
  state = {
    ready: false,
    data: {}
  }

  componentDidMount() {
    csv(config.csvUrl)
      .then(d => this.setState({data: d, ready: true}))
	}

  render() {
    let all = null;
    if (this.state.ready) {
      all = (
        <div>
          <TransferMapComponent data={this.state.data} />
          <TransferTableComponent data={this.state.data} />
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
