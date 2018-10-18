import React from "react";
import { Redirect } from 'react-router-dom';
import axios from "axios";
require('dotenv').config();

export class UploadMediaImg extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      loggedInUser: this.props.userInSession,
      spaceID: this.props.currentSpace, 
      redirect: false
    };
    this.service = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/api`
    });
  }

  handleChange(e) {
    this.setState({
      file: e.target.files[0]
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.uploadImage(this.state.file)
    .then(() => {
      console.log("uploaded image to this space");
      console.log(this.state.img_url);
      this.createMedia(this.state.img_url);
    });
  }

  uploadImage(file) {
    const formData = new FormData();
    formData.append("photo", file);
    //console.log("DEBUG formData", formData.get("photo"));
    return this.service
      .post("/uploadCloud", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then(img => {
        this.setState({ img_url: img.data.secure_url, redirect: true });
      })
      .catch(error => console.log(error));
  }

  createMedia = (image_url) => {
    let media = { url: image_url, type: "IMAGE"};
    return this.service
      .post("/media", media)
      .then(media => {
        console.log("CREATED NEW IMAGE:");
        console.log(media.data);
        this.addMediaToSpace(media.data);
      })
      .catch(error => console.log(error));
  };


  addMediaToSpace = media => {
    let spaceID = this.state.spaceID;
    console.log("SPACE ID UPLOAD IMG "+ spaceID)
    this.updateSpace(media, spaceID);
  };

  updateSpace = (media, spaceId) => {
    let newMedia = media;
    return this.service
      .patch(`/spaces/${spaceId}`, newMedia)
      .then(space => {
        console.log("Space updated on DB " + space.data);
      })
      .catch(error => console.log(error));
  };

  render() {
    
    console.log("SPACE ID UPLOAD IMG "+ this.state.spaceID);

    if(this.state.redirect) return <Redirect to="/" />

    return (
      <div>
        <div /* class="file is-boxed" */>
          <form onSubmit={e => this.handleSubmit(e)}>
            <input /* className="file-input" */ type="file" onChange={e => this.handleChange(e)} /> <br />
            <span className="file-cta">
              <span className="file-label">Choose an image</span>
            </span>
            <button type="submit" isColor='primary'>Upload Images to this Scope</button>
          </form>
        </div>
      </div>
    );
  }
}
