import React, { Component } from 'react';
import './App.css';
import {CanvasPanorama} from "./components/CanvasPanorama";
/* import {DeviceOrientationControls} from "./lib/DeviceOrientationControls";
import {renderPanorama} from "./lib/renderPanorama"; */

class App extends Component {
  render() {
    

    return (<div>
      <div className="App">
      <script src="../src/lib/DeviceOrientationControls.js"></script>
    <script src="../src/lib/renderPanorama.js"></script>
        <header className="header">
        <h1>App</h1>
        </header>
       <CanvasPanorama/>
      </div>
{/* <script src="../src/lib/three.js"></script>
    <script src="../src/lib/DeviceOrientationControls.js"></script>
    <script src="../src/lib/renderPanorama.js"></script> */}
      </div>
    );
  }
}

export default App;
