import React from "react";
import * as THREE from "three";
import DeviceOrientationControls from "../../lib/DeviceOrientationControls";
import CSS3DRenderer from "../../lib/CSS3DRenderer";
import {CSS3elements} from "./CSS3elements";
import axios from "axios";
import { Camera } from "../Camera";


export class ScopeCamera extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spaceRadius: 500,
      camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100),
      sceneCSS: new THREE.Scene(), 
      rendererCSS: new CSS3DRenderer(), 
      id: this.props.id
    };
    this.service = axios.create({
      baseURL: "http://localhost:3010/api"
    });
  }


  init = ({ camera, sceneCSS, rendererCSS }) => {
    this.setState({ controls: new DeviceOrientationControls(camera) });

    camera.position.set(0, 0, -0.001); //-0.001

    rendererCSS.domElement.className = "scopeCSS";

    let data = [];
    for (let i=0; i<=3; i++){
      data.push("41kZovcyHrU")
    }
    console.log(data);
    let group = CSS3elements (this.state.spaceRadius, data)
    sceneCSS.add(group);

    rendererCSS.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(rendererCSS.domElement);
    window.addEventListener("resize", this.onWindowResize, false);
  };

  animate = () => {
    let { camera, sceneCSS, rendererCSS, controls } = this.state;
    window.requestAnimationFrame(this.animate);
    controls.update();
    rendererCSS.render(sceneCSS, camera);
    //console.log(this.state.image)
  };

  onWindowResize = () => {
    let { camera, rendererCSS } = this.state;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    rendererCSS.setSize(window.innerWidth, window.innerHeight);
  };

  componentDidMount = () => {
    this.init(this.state);
    this.animate();
  };

  render() {
    return (
        <div>
            {/* <Camera/> */}
            {/* <video className="camera"id="camera--view" autoPlay playsInline /> */}
        </div>
    )
  }
}
