import React, { Component } from 'react';

import TransferMapComponent from "./TransferMapComponent/TransferMapComponent";
import TransferTableComponent from "./TransferTableComponent/TransferTableComponent";



class App extends Component {


  render() {
    return (
      <div className="App">
        <TransferMapComponent />
        <TransferTableComponent />
      </div>
    );
  }
}

export default App;
