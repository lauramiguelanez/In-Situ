import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
require("dotenv").config();

export default class ProfileID extends Component {
  constructor(props) {
    super(props);
    this.state = {
      followed: false
    };
    this.service = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/api`
    });
    this.props.newPage();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ...this.state, loggedInUser: nextProps["userInSession"] });
    this.getScopes();
  }

  getScopes = () => {
    let username = this.props.match.params.username;
    let promises = [];
    this.service
      .get(`auth/user/${username}`)
      .then(user => {
        this.setState({ userProfileID: user.data._id });
        let isFollowing = this.checkFollowing(user.data._id);
        let catalogId = user.data.catalog;
        this.setState({ catalogId: catalogId, followed:isFollowing, profileUser: username });
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

  handleSubmit(e) {
    e.preventDefault();
    this.followUser(this.state.userProfileID);
    this.setState({ followed: true });
  }

  checkFollowing = followedUserID => {
    console.log("USER IN SESSION CHECK FOLLOWING");
    console.log(this.state.loggedInUser.following);
    let currentUserFollowing = this.state.loggedInUser.following;
    let currentUserID = this.state.loggedInUser._id;
    console.log(currentUserID, followedUserID);
    if (currentUserFollowing) {
      return currentUserFollowing.includes(followedUserID);
    } else {
      return false;
    }
  };

  followUser = followedUserID => {
    let currentUserID = this.props.userInSession._id;
    let isFollowing = this.checkFollowing(followedUserID);
    let follow = { id: followedUserID };
    console.log("FRONT " + followedUserID);
    if (isFollowing !== true) {
      return this.service
        .patch(`/auth/${currentUserID}`, follow)
        .then(user => {
          console.log("User updated on DB " + user.data);
        })
        .catch(error => console.log(error));
    }
  };

  render() {
    let userSpaces = this.state.userSpaces;
    let isFollowEnabled;
    let isFollowText;
    console.log("is followed " + this.state.followed);
    this.state.followed? isFollowEnabled="button is-primary is-outlined follow-button":isFollowEnabled="button is-primary follow-button";
    this.state.followed? isFollowText="Unfollow":isFollowText="Follow";
    if (userSpaces) {
      return (
        <div>
          <div className="profile-feed">
            <div className="profile-user">
              <h1 className="profile-name">@{this.state.profileUser}</h1>
              <form onSubmit={e => this.handleSubmit(e)}>
                <button className={isFollowEnabled} type="submit">
                  {isFollowText}
                </button>
              </form>
            </div>
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
        </div>
      );
    } else {
      return (
        <div className="profile-feed">
          <h1>Login to see profile</h1>
        </div>
      );
    }
  }
}
