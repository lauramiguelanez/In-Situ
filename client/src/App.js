import React, { Component } from "react";
import "./App.scss";
import { ScopeView } from "./components/ScopeView";
import { UploadSpace } from "./components/UploadSpace";

class App extends Component {
  constructor() {
    super();
    this.state = {
      spaceId:"5bbf66722a231332865b6405"
    };
  }
  
  actualizeSpace = (space)=>{
    console.log("SPACE on PARENT");
    console.log(space);
    this.setState({spaceId:space});
    console.log("SPACE on PARENT after change");
    console.log(this.state.spaceId);
  }

  render() {
    console.log("SPACE on PARENT on RENDER");
    console.log(this.state.spaceId);
    return (
      <div>
        <div className="App">
          <header className="header">
            <h1>Welcome to Scope</h1>
          </header>
          <UploadSpace newEspace = {space=>{this.actualizeSpace(space)}}/>
          <ScopeView id = {this.state.spaceId}/>
        </div>
      </div>
    );
  }
}

export default App;
