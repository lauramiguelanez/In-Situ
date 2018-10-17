import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Navbar, NavbarMenu, NavbarItem } from "bloomer";
require('dotenv').config();

export default class ProfileID extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.service = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/api`
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ...this.state, loggedInUser: nextProps["userInSession"] });
    this.getScopes();
  }

  getScopes = () => {
    let username = this.props.match.params.username;
    let promises = [];
    this.service.get(`auth/user/${username}`)
      .then(user => {
        let catalogId = user.data.catalog;
        console.log("USER FROM DB TO PROFILE");
        console.log(user);
        this.setState({ catalogId: catalogId });
        return this.service.get(`/catalog/${catalogId}`);
      })
      .then(catalog => {
        let spacesId = catalog.data.spaces;
        spacesId.forEach(spaceId => {
          promises.push(this.service.get(`/spaces/${spaceId}`));
        });
        return Promise.all(promises);
      })
      .then(promises => {
        let spaces = [];
        promises.forEach(prom => {
          spaces.push(prom.data);
        });
        this.setState({ userSpaces: spaces });
      })
      .catch(error => console.log(error));
  };

  render() {
    let userSpaces = this.state.userSpaces;

    if (userSpaces) {
      userSpaces.forEach(e => {});
      return (
        <div>
          <h1 className="profile-feed">Profile</h1>
          {userSpaces.map(space => {
            return (
              <div key={space._id} className="scope-in-feed">
                <Link to={`/scope/${space._id}`}>
                  <img
                    className="panorama-feed"
                    height="50px"
                    src={space.image}
                  />
                </Link>
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <div className="profile-feed">
          <h1>Profile</h1>
        </div>
      );
    }
  }
}
