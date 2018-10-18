import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedInUser: null };
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
        <nav className="nav-style box">
          <ul>
            <li><a onClick={this.handleLogout}>Logout</a></li>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/profile'>{this.state.loggedInUser.username}</Link></li>
          </ul>
        </nav>
      )
    } else {
      return (
          <nav className="navbar nav-style box" role="navigation" aria-label="main navigation">

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