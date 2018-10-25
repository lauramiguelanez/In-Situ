import React from "react";
import * as THREE from "three";
import DeviceOrientationControls from "../../lib/DeviceOrientationControls";
import TrackballControls from "../../lib/TrackballControls";
import logo from "../../scope white.png";

var sphere;
export class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spaceRadius: 500,
      camera: new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        1100
      ),
      scene: new THREE.Scene(),
      renderer: new THREE.WebGLRenderer({ antialias: true }),
      modal: false
    };
  }

  init = ({ camera, scene, renderer }) => {
    camera.position.set(0, 0, -100); //-0.001

    renderer.domElement.className = "welcome";

    //Panorama Sphere
    var geometry = new THREE.SphereBufferGeometry(
      this.state.spaceRadius,
      100,
      40
    );
    geometry.scale(-1, 1, 1); // invert the geometry on the x-axis so that all of the faces point inward
    var material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      wireframeLinewidth: 5
    });
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    scene.background = new THREE.Color(0x00d1b2);
    let scopeDiv = document.getElementById("welcome");
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    scopeDiv.appendChild(renderer.domElement);
    window.addEventListener("resize", this.onWindowResize, false);
  };

  animate = () => {
    let { camera, scene, renderer } = this.state;
    window.requestAnimationFrame(this.animate);
    sphere.rotation.x += 0.0015;
    sphere.rotation.y += 0.001;
    sphere.rotation.z += 0.0004;
    renderer.render(scene, camera);
  };

  onWindowResize = () => {
    let { camera, renderer } = this.state;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  componentDidMount = () => {
    this.props.newPage();
    this.init(this.state);
    this.animate();
  };

  render() {
    return (
      <div className="home">
        <img src={logo} className="logo" />
        <div id="welcome" className="welcome">
          {/* <div className="card box" id="welcome-card"> */}

          {/* </div>  */}
        </div>
      </div>
    );
  }
}
