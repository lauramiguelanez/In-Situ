import React from "react";

export class Camera extends React.Component {
  constructor() {
    super();
    this.state = {
      cameraView: document.querySelector("#camera--view"),
      constraints: { video: { facingMode: "environment" }, audio: false }
    };
  }

 

  cameraStart = () => {
    let cameraView = document.querySelector("#camera--view");
    navigator.mediaDevices
      .getUserMedia(this.state.constraints)
      .then(function(stream) {
        let track = stream.getTracks()[0];
        cameraView.srcObject = stream;
      })
      .catch(function(error) {
        console.error("Oops. Something is broken.", error);
      });
  };

  componentDidMount=()=>{
    this.cameraStart();
  }

  render() {
    return (
      <video className="camera"id="camera--view" autoPlay playsInline />      
    );
  }
}
