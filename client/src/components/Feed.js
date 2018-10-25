import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
require("dotenv").config();

export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: props.userInSession
    };
    this.service = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/api`
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ...this.state, loggedInUser: nextProps["userInSession"] });
    this.props.newPage();
    //this.getFeedScopes();
  }

  getFeedScopes = () => {
    let following = this.state.loggedInUser.following;
    let usersF = [];
    let catalogsF = [];
    let spacesF = [];
    let promFollowedUsers = [];
    let promFollowedCatalogs = [];
    let promFollowedSpaces = [];
    let spaceLength = [];
    let owner=[];
    following.forEach(followedUser => {
      promFollowedUsers.push(this.service.get(`/auth/u/${followedUser}`));
    });
    return Promise.all(promFollowedUsers).then(FollowedUsers => {
      FollowedUsers.forEach(e => {
        usersF.push(e.data);
      });
      usersF.forEach(user => {
        let catalogId = user.catalog;
        promFollowedCatalogs.push(this.service.get(`/catalog/${catalogId}`));
      });
      return Promise.all(promFollowedCatalogs)
        .then(FollowedCatalogs => {
          FollowedCatalogs.forEach(e => {
            catalogsF.push(e.data.spaces);
          });
          catalogsF.forEach(spaceArr => {
            spaceLength.push(spaceArr.length);
            spaceArr.forEach(space => {
              promFollowedSpaces.push(this.service.get(`/spaces/${space}`));
            });
            return Promise.all(promFollowedSpaces).then(FollowedSpaces => {
                usersF.forEach((u,j)=>{
                    for(let i=0;i<spaceLength[j];i++){
                        owner.push(u.username);
                    }
                })
              FollowedSpaces.forEach((e,i) => {
                let obj = { _id: e.data._id, image: e.data.image,username:owner[i] };
                spacesF.push(obj);
              });
              this.setState({ feedSpaces: spacesF });
              console.log(spaceLength)
            });
          });
        })
        .catch(error => console.log(error));
    });
  };
  componentDidMount(){
    this.getFeedScopes();
  }

  render() {
    let feedSpaces = this.state.feedSpaces;

    if (feedSpaces) {
      return (
        <div className="profile-feed">
          {feedSpaces.map(space => {
            console.log(space);
            return (
              <div key={space._id} className="scope-in-feed">
                <p>{space.username}</p>
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
          <h1>Follow other users to see their Scopes</h1>
        </div>
      );
    }
  }
}
