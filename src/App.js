import React, { Component } from 'react';

import TransferMapComponent from "./TransferMapComponent/TransferMapComponent";
import TransferTableComponent from "./TransferTableComponent/TransferTableComponent";
import config from "./config";


class App extends Component {
  state = {
    ready: true
  }

  render() {

    let all = null;
    if (this.state.ready) {
      all = (
        <div>
          <TransferMapComponent />
          <TransferTableComponent />
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
