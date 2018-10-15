import React from "react";
import axios from "axios";

export class UploadMediaImg extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      loggedInUser: this.props.userInSession,
      spaceID: this.props.currentSpace
    };
    this.service = axios.create({
      baseURL: "http://localhost:3010/api"
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
        this.setState({ img_url: img.data.url });
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
    return (
      <div>
        <form onSubmit={e => this.handleSubmit(e)}>
          <input type="file" onChange={e => this.handleChange(e)} /> <br />
          <button type="submit">Upload Image</button>
        </form>
      </div>
    );
  }
}
