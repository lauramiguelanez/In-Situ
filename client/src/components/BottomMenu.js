import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";

export default class BottomMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedInUser: null };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ...this.state, loggedInUser: nextProps["userInSession"] });
  }

  render() {
    let page = this.props.page;
    console.log("Page in bottomMenu " + page);

    if (page == "Scope") {
      return <div />;
    }

    if (this.state.loggedInUser && page !== "Scope") {
      return (
        <nav className="nav-style box" id="bottom-nav">
          <NavLink
            className="not-filled-feed"
            activeClassName="filled-feed"
            to="/feed"
          />
          <NavLink className="not-filled-add" to="/upload-scope/" />
          <NavLink
            className="not-filled-explore"
            activeClassName="filled-explore"
            to="/explore"
          />
        </nav>
      );
    } else {
      return (
        <nav
          className="nav-style box"
          id="bottom-nav"
          role="navigation"
          aria-label="main navigation"
        >
          <NavLink className="not-filled-add" to="/upload-scope/" />
        </nav>
      );
    }
  }
}
