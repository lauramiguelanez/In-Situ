import React from "react";

var constraints = { video: { facingMode: "user" }, audio: false };
//const cameraView = document.querySelector("#camera--view");
//const cameraSensor = document.querySelector("#camera--sensor");

export class Camera extends React.Component {
  constructor() {
    super();
    this.state = {
      cameraView: document.querySelector("#camera--view")
    };
  }

  cameraStart = () => {
    let cameraView = document.querySelector("#camera--view");
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function(stream) {
        let track = stream.getTracks()[0];
        cameraView.srcObject = stream;
      })
      .catch(function(error) {
        console.error("Oops. Something is broken.", error);
      });
  };

  render() {
    window.addEventListener("load", this.cameraStart, false);
    return (
      <main id="camera">
        <video id="camera--view" autoPlay playsInline />
      </main>
    );
  }
}
