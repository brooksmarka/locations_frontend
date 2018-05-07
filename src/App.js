import React, { Component } from "react";
import "./App.css";
import Map from "./Components/Map";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <h1 className="App-title">Locations</h1>
        </header>
        <Map />
      </div>
    );
  }
}

export default App;
