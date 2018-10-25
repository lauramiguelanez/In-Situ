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
  let page = this.props.page;
  console.log("Page in bottomMenu "+ page);

    if(page == "Scope"){
      return <div/>
    }

   if (this.state.loggedInUser && page !== "Scope") {
      return (
        <nav className="nav-style box" id="bottom-nav">
          <ul className="nav-width">
            <li><Link to='/feed'>Friends</Link></li>
            <li><Link to='/upload-scope/'><img className="profile-pic" src="/add.svg"></img></Link>{/* </button> */}</li>
            <li><Link to='/explore'>Explore</Link></li>
          </ul>
        </nav>
      )
    } else {
      return (
          <nav className="nav-style box" id="bottom-nav" role="navigation" aria-label="main navigation">
            <ul>
              <li><Link to='/explore'>Explore</Link></li>
            </ul>
          </nav>
          
      )
    }
  }
}


