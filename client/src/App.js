import React, { Component } from "react";
import "./App.scss";
import { ScopeView } from "./components/ScopeView";
import { UploadSpace } from "./components/UploadSpace";

class App extends Component {
  render() {
    return (
      <div>
        <div className="App">
          <header className="header">
            <h1>Welcome to Scope</h1>
          </header>
          <UploadSpace/>
          <ScopeView/>
        </div>
      </div>
    );
  }
}

export default App;
