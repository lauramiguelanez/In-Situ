import React from "react";
import axios from "axios";

export class UploadMediaVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: this.props.userInSession,
      spaceID: this.props.currentSpace,
      youtubeID: ""
    };
    this.service = axios.create({
      baseURL: "http://localhost:3010/api"
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("uploaded youtube video to this space");
    console.log(this.state.img_url);
    this.createMedia(this.state.youtubeID);
  }

  handleChange = event => {
    /* const { name, value } = event.target;
    this.setState({ [name]: value }); */
    console.log(event);
    const value = event.target.value;
    this.setState({ youtubeID: value }); 
  };

  createMedia = youtubeID => {
    let media = { url: youtubeID, type: "YOUTUBE" };
    return this.service
      .post("/media", media)
      .then(media => {
        console.log("CREATED NEW YOUTUBE VIDEO:");
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
          <input
            type="text"
            name="youtubeID"
            onChange={e => this.handleChange(e)}
            placeholder="VVsCOnWGHh8"
          />
          <button type="submit">Upload Media</button>
        </form>
      </div>
    );
  }
}
