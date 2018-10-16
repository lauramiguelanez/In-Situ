import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Navbar, NavbarMenu, NavbarItem } from "bloomer";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = { loggedInUser: null };
    this.service = axios.create({
      baseURL: "http://localhost:3010/api"
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ...this.state, loggedInUser: nextProps["userInSession"] });
    this.getScopes();
  }

  getScopes = () => {
    let catalogId = this.state.loggedInUser.catalog;
    let promises = [];
    this.setState({ catalogId: catalogId });
    return this.service
      .get(`/catalog/${catalogId}`)
      .then(catalog => {
        console.log("Catalog");
        console.log(catalog.data.spaces);
        let spacesId = catalog.data.spaces;
        spacesId.forEach(spaceId => {
          promises.push(this.service.get(`/spaces/${spaceId}`));
        });
        return Promise.all(promises);
      })
      .then(promises => {
        console.log("SPACES");
        let spaces = [];
        promises.forEach(prom => {
          spaces.push(prom.data);
        });
        this.setState({ userSpaces: spaces });
        console.log(this.state.userSpaces);
      })
      .catch(error => console.log(error));
  };

  render() {
    let userSpaces = this.state.userSpaces;
    console.log("Render SPACES");
    console.log(userSpaces);

    if(userSpaces){
        userSpaces.forEach(e=>{
            console.log("IMAGE: "+ e.image);
        })
        return (
            <div>
              <h1>Profile</h1>
             {userSpaces.map(space => {
                return ( 
                    <img key={space._id} height="50px" src={space.image} />
                )
              })} 
            </div>
          );
    }else{
        return (
            <div>
              <h1>Profile</h1>
            </div>
          );
    }
    
  }
}
