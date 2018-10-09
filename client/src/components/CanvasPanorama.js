import React from "react";
import * as THREE from "three";

export class CanvasPanorama extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      camera: new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000),
      scene: new THREE.Scene(),
      renderer: new THREE.WebGLRenderer({ antialias: true }),
      mesh: new THREE.Mesh(new THREE.BoxBufferGeometry(200, 200, 200), new THREE.MeshBasicMaterial({ color: 0xffff00 }))
    };
  }


  init = ({ camera, scene, renderer, mesh }) => {
    //camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera = this.state.camera;
    camera.position.z = 400;
    //scene = new THREE.Scene();
    //var texture = new THREE.TextureLoader().load("textures/crate.gif");
    var geometry = new THREE.BoxBufferGeometry(200, 200, 200);
    var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    mesh = new THREE.Mesh(geometry, material);
    this.setState({mesh: mesh});
    scene.add(mesh);
    //renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
  };

  animate = () => {
    let { camera, scene, renderer, mesh } = this.state;
    requestAnimationFrame(this.animate);
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
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
