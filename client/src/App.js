import React, { Component } from "react";
import "./App.css";
import { CanvasPanorama } from "./components/CanvasPanorama";
import { Scope } from "./components/Scope";

class App extends Component {
  render() {
    return (
      <div>
        <div className="App">
          <script src="../src/lib/DeviceOrientationControls.js" />
          <script src="../src/lib/renderPanorama.js" />
          <header className="header">
            <h1>App</h1>
          </header>
          <Scope />
          <CanvasPanorama />
        </div>
      </div>
    );
  }
}

export default App;
