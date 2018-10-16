import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Navbar, NavbarMenu, NavbarItem } from "bloomer";

export default class BottomMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedInUser: null };
    //this.service = new AuthService();
  }

  render() {
    return (
      <Navbar>
        <NavbarMenu>
          <NavbarItem href='#/'>Home</NavbarItem>
        </NavbarMenu>
      </Navbar>
    );
  }
}
