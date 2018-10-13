import React from "react";
import * as THREE from "three";
import DeviceOrientationControls from "../lib/DeviceOrientationControls";
import TrackballControls from "../lib/TrackballControls";
import OrbitControls from "../lib/OrbitControls";
import CSS3DRenderer from "../lib/CSS3DRenderer";
import CSS3DObject from "../lib/CSS3DObject";
import axios from "axios";

export class Scope extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100),
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

  getImage = (id) => {
    return this.service
      .get(`/spaces/${id}`)
      .then(space => {
        this.setState({ image: space.data.image });
        console.log("Image from DB " + space.data.image);
      })
      .catch(error => console.log(error));
  };

  init = ({ camera, scene, renderer, sceneCSS, rendererCSS }) => {
    //this.setState({ controls: new DeviceOrientationControls(camera) });
    this.setState({ controls: new TrackballControls(camera) });
    //this.setState({ controls: new OrbitControls(camera) });
    /* this.state.controls.rotateSpeed = 1.0;
    this.state.controls.zoomSpeed = 1.2;
    this.state.controls.panSpeed = 0.8;*/
    camera.position.set(0, 0, -0.001); //-0.001

    renderer.domElement.className = "scope";
    //Panorama Sphere
    var geometry = new THREE.SphereBufferGeometry(500, 60, 40);
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
    scene.add(helper);


    let element = document.createElement('div');
    //element.innerHTML = 'Plain text inside a div.';
    element.style.background = "#0094ff";
    element.style.fontSize = "2em";
    element.style.color = "white";
    //element.style.padding = "2em";
    let iframe = document.createElement( 'iframe' );
    let video = "41kZovcyHrU";
    iframe.src =`https://www.youtube.com/embed/${video}?&autoplay=1`;
		element.appendChild( iframe );
    let div = new CSS3DObject(element);
    div.position.x = 200;
    div.position.y = 200;
    div.position.z = 200;
    div.rotation.y = Math.PI;
    sceneCSS.add(div);
    
/*     var geometryP = new THREE.PlaneGeometry( 10, 10, 2,2 );
    var materialP = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    var plane = new THREE.Mesh( geometryP, materialP );
    plane.position.set(20, 20, 10);
    scene.add( plane );  */


    //renderer.setPixelRatio(window.devicePixelRatio);
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
    return <div />;
  }
}
