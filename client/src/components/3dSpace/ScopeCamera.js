import React from "react";
import * as THREE from "three";
import DeviceOrientationControls from "../../lib/DeviceOrientationControls";
import CSS3DRenderer from "../../lib/CSS3DRenderer";
import {CSS3elements} from "./CSS3elements";
import { Camera } from "../Camera";
import axios from "axios";
require('dotenv').config();


export class ScopeCamera extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spaceRadius: 500,
      camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100),
      scene: new THREE.Scene(),
      sceneCSS: new THREE.Scene(), 
      renderer: new THREE.WebGLRenderer({ antialias: true }),
      rendererCSS: new CSS3DRenderer(), 
      id: this.props.id
    };
    this.service = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/api`
    });
  }

  getImage = (id) => {
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
  
    camera.position.set(0, 0, -0.0001); //-0.001

    renderer.domElement.className = "scopehidden";
    rendererCSS.domElement.className = "scopeCSS";
    
    //Panorama Sphere
    var geometry = new THREE.SphereBufferGeometry(this.state.spaceRadius, 60, 40);
    geometry.scale(-1, 1, 1); // invert the geometry on the x-axis so that all of the faces point inward
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "";
    const map = loader.load(this.state.image);
    var material = new THREE.MeshBasicMaterial({ map });
    var sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    
    //Helper Geometry
    var helperGeometry = new THREE.BoxBufferGeometry(100, 100, 100, 4, 4, 4);
    var helperMaterial = new THREE.MeshBasicMaterial({color: 0xff00ff, wireframe: true});
    var helper = new THREE.Mesh(helperGeometry, helperMaterial);
    //scene.add(helper);

    let media = this.state.media;
    let group;
    console.log("MEDIA FROM THIS SPACE DB");
    console.log(media);
    if(media!=undefined){
      group = CSS3elements (this.state.spaceRadius, media);
      console.log(group);
      sceneCSS.add(group);
    }



    let scopeDiv = document.getElementById("scopecamdiv");
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    scopeDiv.appendChild(renderer.domElement);
    rendererCSS.setSize(window.innerWidth, window.innerHeight);
    //document.body.appendChild(rendererCSS.domElement);
    scopeDiv.appendChild(rendererCSS.domElement);
    window.addEventListener("resize", this.onWindowResize, false);
  };

  animate = () => {
    let { camera, scene, renderer, sceneCSS, rendererCSS, controls } = this.state;
    window.requestAnimationFrame(this.animate);
    controls.update();
    renderer.render(scene, camera);
    rendererCSS.render(sceneCSS, camera);
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
    //console.log("FIRST ID "+id)
    this.getImage(id).then(() => {
      this.init(this.state);
      this.animate();
    });
  };

  componentDidUpdate = prevProps => {
    if (this.props.id !== prevProps.id) {
      let newId = this.props.id;
      this.setState({ id: newId });
      this.getImage(newId).then(() => {
        this.init(this.state);
        this.animate();
      });
    }
  };

  render() {
    return <div id="scopecamdiv"><Camera/></div>;
  }
}
