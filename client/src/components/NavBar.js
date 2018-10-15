import React, { Component } from 'react';
import { Link } from 'react-router-dom';
//import AuthService from '../auth/AuthService';

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
          </ul>

          <h2>Welcome, {this.state.loggedInUser.username}</h2>
        </nav>
      )
    } else {
      return (
        <div>
          <nav className="nav-style">
            <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/signup'>Signup</Link></li>
            <li><Link to='/login'>Login</Link></li>
            </ul>
          </nav>
        </div>
      )
    }
  }
}