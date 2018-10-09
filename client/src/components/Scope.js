import React from "react";
import * as THREE from "three";
import DeviceOrientationControls from "../lib/DeviceOrientationControls";

export class Scope extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100),
      //controls: new DeviceOrientationControls(this.camera),
      scene: new THREE.Scene(),
      renderer: new THREE.WebGLRenderer({antialias: true})
    };
  }

  init = ({ camera, scene, renderer }) => {
    this.state.controls = new DeviceOrientationControls(camera);

    var geometry = new THREE.SphereBufferGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // invert the geometry on the x-axis so that all of the faces point inward

    var material = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("panoramas/maxresdefault.jpg")
    });

    var sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    var helperGeometry = new THREE.BoxBufferGeometry(100, 100, 100, 4, 4, 4);
    var helperMaterial = new THREE.MeshBasicMaterial({
      color: 0xff00ff,
      wireframe: true
    });
    var helper = new THREE.Mesh(helperGeometry, helperMaterial);
    scene.add(helper);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    //window.addEventListener("resize", onWindowResize, false);
  };

  animate = () => {
    let { camera, scene, renderer, controls } = this.state;
    window.requestAnimationFrame(this.animate);
    controls.update();
    renderer.render(scene, camera);
  };

  componentDidMount = () => {
    this.init(this.state);
    this.animate();
  };

  render() {
    return <div/>;
  }
}
