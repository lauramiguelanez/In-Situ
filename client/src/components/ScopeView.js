import React, { Component } from "react";
import { Scope } from "./3dSpace/Scope";

export class ScopeView extends Component {
    render() {
      return (
          <div className="ScopeView">
            <Scope id={this.props.id}/>
          </div>
      );
    }
  }