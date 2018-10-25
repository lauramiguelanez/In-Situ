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
    let page = this.props.page;
    console.log("Page in navBar "+ page);

    if (this.state.loggedInUser && page == "Profile") {
      return (
        <nav className="nav-style box" id="top-nav">
          <ul className="nav-width">
            <li className="has-text-danger"><Link to='/'>Home</Link></li>
            <li><a onClick={this.handleLogout}>Logout</a></li>
            <li><Link to='/profile'> @{this.state.loggedInUser.username}</Link></li>
          </ul>
        </nav>
      )
    } else if (this.state.loggedInUser && page == "ProfileID") {
      return (
        <nav className="nav-style box" id="top-nav">
          <ul className="nav-width">
            <li className="has-text-danger"><Link to='/'>Home</Link></li>
            {/* <li>@{this.state.loggedInUser.username}</li> */}
            <li><Link to='/profile'><img className="profile-pic" src="/user.svg"></img></Link></li>
          </ul>
        </nav>
      )
    } else if (this.state.loggedInUser) {
      return (
        <nav className="nav-style box" id="top-nav">
          <ul className="nav-width">
            <li className="has-text-danger"><Link to='/'>Home</Link></li>
            {/* <li><a onClick={this.handleLogout}>Logout</a></li> */}
            <li><Link to='/profile'>{/* @{this.state.loggedInUser.username}*/}<img className="profile-pic" src="/user.svg"></img></Link></li>
          </ul>
        </nav>
      )
    } else {
      return (
          <nav className="nav-style box" id="top-nav" role="navigation" aria-label="main navigation">
            <ul className="nav-width">
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/signup'>Signup</Link></li>
            <li><Link to='/login'>Login</Link></li>
            </ul>
          </nav>
      )
    }
  }
}