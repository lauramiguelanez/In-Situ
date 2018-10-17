import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
            <li><Link to='/scope'>Scope</Link></li>
            <li><Link to='/profile'>{this.state.loggedInUser.username}</Link></li>
          </ul>
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