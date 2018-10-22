import React from "react";
import { Link } from "react-router-dom";
import geolocalize from "../maps/geolocalize";
import * as THREE from "three";
import DeviceOrientationControls from "../../lib/DeviceOrientationControls";
import CSS3DRenderer from "../../lib/CSS3DRenderer";
import {CSS3elements} from "./CSS3elements";
import axios from "axios";
require('dotenv').config();


export class ScopeID extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spaceRadius: 500,
      camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100),
      scene: new THREE.Scene(),
      sceneCSS: new THREE.Scene(), 
      renderer: new THREE.WebGLRenderer({ antialias: true }),
      rendererCSS: new CSS3DRenderer(),
      isInLocation: false
    };
    this.service = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/api`
    });
  }

  getImage = (id) => {
    let promises = [];
    return this.service
      .get(`/spaces/${id}`)
      .then(space => {
        this.setState({ image: space.data.image, mediaIDs: space.data.media });
        this.sendNewSpace(space.data);
      })
      .then(()=>{
        let mediaIDs = this.state.mediaIDs;
        mediaIDs.forEach(mediaID => {
          if (typeof mediaID == "object"){
            mediaID = mediaID._id;
          }
          promises.push(this.service.get(`/media/${mediaID}`));
        });
        return Promise.all(promises);
      })
      .then(promises => {
        let mediaArr=[];
        promises.forEach(prom => {
          mediaArr.push(prom.data);
        })
        this.setState({media: mediaArr});
      })
      .catch(error => console.log(error));
  };

  sendNewSpace = space => {
    this.props.newSpace(space._id, space.location);
  }; 

  init = ({ camera, scene, renderer, sceneCSS, rendererCSS }) => {
    this.setState({ controls: new DeviceOrientationControls(camera) });
    camera.position.set(0, 0, -0.001);

    renderer.domElement.className = "scope";
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

    let media = this.state.media;
    let group;
    if(media!==undefined){
      group = CSS3elements (this.state.spaceRadius, media);
      sceneCSS.add(group);
    }
  
    let scopeDiv = document.getElementById("scopediv");
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    scopeDiv.appendChild(renderer.domElement);
    rendererCSS.setSize(window.innerWidth, window.innerHeight);
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
    let id =  this.props.match.params.id;
    geolocalize().then(center => {
      this.setState({currrentLocation: center});
    });
    this.getImage(id).then(() => {
      this.init(this.state);
      this.animate();
    });
  };

  render() {
    let id =  this.props.match.params.id;
    return (
    <div id="scopediv">
        <button className="button is-white is-outlined is-rounded switch-button white"><Link to={`/camera/${id}`}>AR</Link></button>
    </div>
    );
  }
}
