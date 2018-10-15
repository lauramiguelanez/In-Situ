import React from "react";
import * as THREE from "three";
import DeviceOrientationControls from "../../lib/DeviceOrientationControls";
import CSS3DRenderer from "../../lib/CSS3DRenderer";
import { CSS3elements } from "./CSS3elements";
import { Camera } from "../Camera";
import axios from "axios";

export class ScopeCamera extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spaceRadius: 500,
      camera: new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 ),
      scene: new THREE.Scene(),
      sceneCSS: new THREE.Scene(),
      renderer: new THREE.WebGLRenderer({ antialias: true }),
      rendererCSS: new CSS3DRenderer(),
      id: this.props.id
    };
    this.service = axios.create({
      baseURL: "http://localhost:3010/api"
    });
  }

  getImage = id => {
    return this.service
      .get(`/spaces/${id}`)
      .then(space => {
        this.setState({ image: space.data.image, media: space.data.media });
        console.log("Image from DB " + space.data.image);
      })
      .catch(error => console.log(error));
  };

  init = ({ camera, scene, renderer, sceneCSS, rendererCSS }) => {
    this.setState({ controls: new DeviceOrientationControls(camera) });
    camera.position.set(0, 0, -0.0001);

    renderer.domElement.className = "scopehidden";
    rendererCSS.domElement.className = "scopeCSS";

    //Helper Geometry
    var helperGeometry = new THREE.BoxBufferGeometry(100, 100, 100, 4, 4, 4);
    var helperMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
    var helper = new THREE.Mesh(helperGeometry, helperMaterial);
    scene.add(helper);

    console.log("MEDIA FROM THIS SPACE DB");
    console.log(this.state.media);
    let group = CSS3elements(this.state.spaceRadius, this.state.media);
    sceneCSS.add(group);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    rendererCSS.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(rendererCSS.domElement);
    //.setAttribute("id", "scope");
    window.addEventListener("resize", this.onWindowResize, false);
  };

  animate = () => {
    let { camera, scene, renderer, sceneCSS, rendererCSS, controls } = this.state;
    window.requestAnimationFrame(this.animate);
    controls.update();
    renderer.render(scene, camera);
    rendererCSS.render(sceneCSS, camera);
    //console.log(this.state.image)
  };

  onWindowResize = () => {
    let { camera, renderer, rendererCSS } = this.state;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererCSS.setSize(window.innerWidth, window.innerHeight);
  };

  componentDidMount = () => {
    let id = this.state.id;
    this.init(this.state);
    this.animate();
  };

  componentDidUpdate = prevProps => {
    if (this.props.id !== prevProps.id) {
      let newId = this.props.id;
      this.setState({ id: newId });
      this.init(this.state);
      this.animate();
    }
  };

  render() {
    return (
      <div>
        <Camera />
      </div>
    );
  }
}
