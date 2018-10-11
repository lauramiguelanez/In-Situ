import React from "react";
import axios from "axios";

export class UploadSpace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange(e) {
    console.log('handleChange');
    console.log('DEBUG e.target.files[0]', e.target.files[0]);
    this.setState({
      file: e.target.files[0]
    })
  }
  handleSubmit(e) {
    e.preventDefault()
    this.uploadImage(this.state.file)
  }

  uploadImage(file) {
    const formData = new FormData();
    formData.append("photo", file);
    console.log("DEBUG formData", formData.get("picture"));
    return axios.post("http://localhost:3010/api/uploadCloud", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(img => {
        this.setState({ img_url: img.data.url });
        console.log("Image from Cloud " + img);
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <div>
        <form onSubmit={e => this.handleSubmit(e)}>
          <input type="file" onChange={e => this.handleChange(e)} /> <br />
          <button type="submit">Upload a panorama of your space</button>
        </form>
      </div>
    );
  }
}
