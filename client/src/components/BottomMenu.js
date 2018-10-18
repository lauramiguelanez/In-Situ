import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class BottomMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedInUser: null };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ...this.state, loggedInUser: nextProps["userInSession"] })
  }

  render() {
   // if (this.state.loggedInUser) {

      return (
        <nav className="nav-style box" id="bottom-nav">
          <ul>
            <li><Link to='/upload-media-img'>+Image</Link></li>
            <li>{/* <button className="button is-primary is-rounded"> */}<Link to='/upload-scope/'>New</Link>{/* </button> */}</li>
            <li><Link to='/upload-media-video'>+Video</Link></li>
          </ul>
        </nav>
      )
    /* } else {
      return (
          <nav className="nav-style box" id="bottom-nav" role="navigation" aria-label="main navigation">
            <ul>
            <li><Link to='/'>Home</Link></li>
            </ul>
          </nav>
          
      )
    } */
  }
}


