import React from "react";
import { Redirect } from 'react-router-dom';
import axios from "axios";
import geolocalize from "../maps/geolocalize";
require('dotenv').config();

export class UploadSpace extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loggedInUser: this.props.userInSession, redirect: false };
    this.service = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/api`
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ...this.state, loggedInUser: nextProps["userInSession"] })
  }

  handleChange(e) {
    this.setState({
      file: e.target.files[0]
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.uploadImage(this.state.file).then(() => {
      console.log("uploaded image to create space");
      console.log(this.state.img_url);
      geolocalize().then(center => {
        console.log(center);
        this.createSpace(this.state.img_url, center);
      });
    });
  }

  uploadImage(file) {
    const formData = new FormData();
    formData.append("photo", file);
    return this.service
      .post("/uploadCloud", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then(img => {
        this.setState({ img_url: img.data.secure_url, redirect: true });
      })
      .catch(error => console.log(error));
  }

  createSpace = (image_url, center) => {
    let { lat, lng } = center;
    console.log(center);
    let user = this.state.loggedInUser;
    console.log("USER IN CREATE SPACE");
    console.log(user);
    let space = { image: image_url, creator: user._id, location: center };
    return this.service
      .post("/spaces", space)
      .then(space => {
        console.log("CREATED NEW SPACE:");
        console.log(space.data);
        this.sendNewSpace(space.data);
        this.addSpaceToUser(space.data);
      })
      .catch(error => console.log(error));
  };

  sendNewSpace = space => {
    this.props.newSpace(space._id, space.location);
  };

  addSpaceToUser = space => {
    let user = this.state.loggedInUser;
    console.log("ADD TO USER CATALOG");
    console.log(space);
    console.log(user);
    this.updateCatalog(user.catalog, space._id);
  };

  updateCatalog = (catalogId, spaceId) => {
    let newSpace = { spaceId };
    return this.service
      .patch(`/catalog/${catalogId}`, newSpace)
      .then(catalog => {
        console.log("Catalog updated on DB " + catalog.data);
      })
      .catch(error => console.log(error));
  };

  render() {

    if(this.state.redirect) return <Redirect to="/" />

    return (
      <div className="form-card box">
        <div className="file">
          <form onSubmit={e => this.handleSubmit(e)}>
            <label className="file-label">
              <input className="file-input" type="file" onChange={e => this.handleChange(e)} />
              <span className="file-cta">
                <span className="file-label">Take a panoramic photo</span>
              </span>
            </label>
            <button className="button is-primary" type="submit">Upload</button>
          </form>

        </div>
      </div>
    );
  }
}





