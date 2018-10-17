import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import AuthService from '../auth/AuthService';
import "bulma/css/bulma.css";
import { Button } from "bloomer";

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedInUser: null };
    //this.service = new AuthService();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ...this.state, loggedInUser: nextProps["userInSession"] })
  }

  handleLogout = (e) => {
    this.props.logout()
  }

  render() {
    console.log("USER IN NAVBAR");
    console.log(this.state.loggedInUser);
    if (this.state.loggedInUser) {

      return (
        <nav className="nav-style">
          <ul>
            <li><a onClick={this.handleLogout}>Logout</a></li>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/scope'>See Scope</Link></li> {/* FALTA ID */}
            <li><Link to='/camera'>See AR</Link></li> {/* FALTA ID */}
            <li><Link to='/upload-scope'>New Scope</Link></li>
            <li><Link to='/upload-media-img'>Add Image</Link></li>
            <li><Link to='/upload-media-video'>Add Video</Link></li>
            <li><Link to='/profile'>My Profile</Link></li>
          </ul>

          <h2>Welcome, {this.state.loggedInUser.username}</h2>
        </nav>
      )
    } else {
      return (
          <nav className="navbar" role="navigation" aria-label="main navigation">

            <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/signup'>Signup</Link></li>
            <li><Link to='/login'>Login</Link></li>
            </ul>
          </nav>
      )
    }
  }
}