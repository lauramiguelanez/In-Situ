import React, { Component } from "react";
import "./App.css";
import { ScopeView } from "./components/ScopeView";

class App extends Component {
  render() {
    return (
      <div>
        <div className="App">
          <header className="header">
            <h1>Welcome to Scope</h1>
          </header>
          <ScopeView/>
        </div>
      </div>
    );
  }
}

export default App;
