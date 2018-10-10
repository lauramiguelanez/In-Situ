import React from "react";
import * as THREE from "three";
import DeviceOrientationControls from "../lib/DeviceOrientationControls";
import axios from 'axios';

export class Scope extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100),
      scene: new THREE.Scene(),
      renderer: new THREE.WebGLRenderer({antialias: true})
    };
  }

  getImage = ()=>{
    let id = "5bbe25ab0fc16b19a0788676"
    return axios.get(`http://localhost:3010/api/spaces/${id}`)
    .then( (space) => {
        this.setState({image: space.data.image});
        console.log("Image from DB " + space.data.image);
    })
    .catch( error => console.log(error) )
  }

  init = ({ camera, scene, renderer }) => {
    this.setState({controls: new DeviceOrientationControls(camera)});
    
    console.log("Image at INIT " + this.state.image);
    var geometry = new THREE.SphereBufferGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // invert the geometry on the x-axis so that all of the faces point inward

    const loader = new THREE.TextureLoader()
    loader.crossOrigin = '';
    const map = loader.load(this.state.image);
    var material = new THREE.MeshBasicMaterial({map});
    var sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    /* var helperGeometry = new THREE.BoxBufferGeometry(100, 100, 100, 4, 4, 4);
    var helperMaterial = new THREE.MeshBasicMaterial({color: 0xff00ff, wireframe: true});
    var helper = new THREE.Mesh(helperGeometry, helperMaterial);
    scene.add(helper); */

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    window.addEventListener("resize", this.onWindowResize, false);
  };

  animate = () => {
    let { camera, scene, renderer, controls } = this.state;
    window.requestAnimationFrame(this.animate);
    controls.update();
    renderer.render(scene, camera);
  };

  onWindowResize = () => {
    let { camera, renderer } = this.state;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  componentDidMount = () => {
    this.getImage().then(()=>{
      this.init(this.state);
      this.animate();
    })
  };

  render() {
    return <div/>;
  }
}
