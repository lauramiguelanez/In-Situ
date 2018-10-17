import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Navbar, NavbarMenu, NavbarItem } from "bloomer";

export default class BottomMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedInUser: null };
    //this.service = new AuthService();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ...this.state, loggedInUser: nextProps["userInSession"] })
  }

  render() {
   // if (this.state.loggedInUser) {

      return (
        <nav className="nav-style" id="bottom-nav">
          <ul>
            <li><Link to='/camera'>Camera</Link></li> {/* FALTA ID */}
            <li><Link to='/upload-scope'>New</Link></li>
            <li><Link to='/upload-media-img'>Add Image</Link></li>
            <li><Link to='/upload-media-video'>Add Video</Link></li>
          </ul>
        </nav>
      )
    /* } else {
      return (
          <nav className="nav-style" id="bottom-nav" role="navigation" aria-label="main navigation">
            <ul>
            <li><Link to='/'>Home</Link></li>
            </ul>
          </nav>
      )
    } */
  }
}
