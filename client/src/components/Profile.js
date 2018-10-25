import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Navbar, NavbarMenu, NavbarItem } from "bloomer";
require("dotenv").config();

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedInUser: props.userInSession };
    this.service = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/api`
    });
    this.getScopes();
    this.props.newPage();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ...this.state, loggedInUser: nextProps["userInSession"] });
  }

  getScopes = () => {
    let catalogId = this.props.userInSession.catalog;
    let promises = [];
    this.setState({ catalogId: catalogId });
    return this.service
      .get(`/catalog/${catalogId}`)
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
    if (this.props.userInSession) {
      let userSpaces = this.state.userSpaces;
      if (userSpaces) {
        userSpaces.forEach(e => {});
        return (
          <div className="profile-feed">
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
          </div>
        );
      }
    } else {
      return <div />;
    }
  }
}
