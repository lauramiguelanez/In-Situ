import React, { Component } from "react";
import { Scope } from "../components/Scope";

export class ScopeView extends Component {
    render() {
      return (
          <div className="ScopeView">
            <Scope id={this.props.id}/>
          </div>
      );
    }
  }