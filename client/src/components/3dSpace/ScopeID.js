import React from "react";
import { Link } from "react-router-dom";
import geolocalize from "../maps/geolocalize";
import * as THREE from "three";
import DeviceOrientationControls from "../../lib/DeviceOrientationControls";
import TrackballControls from "../../lib/TrackballControls";
import CSS3DRenderer from "../../lib/CSS3DRenderer";
import {CSS3elements} from "./CSS3elements";
import axios from "axios";
import { runInThisContext } from "vm";
import { UploadMediaImg } from "../upload/UploadMediaImg";
import { UploadMediaVideo } from "../upload/UploadMediaVideo";
import { UploadMediaText } from "../upload/UploadMediaText";
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
      isInLocation: false,
      isLiked: false,
      likes: 0,
      modal: false
    };
    this.service = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/api`
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ ...this.state, loggedInUser: nextProps["userInSession"] });
  }

  getImage = (id) => {
    let promises = [];
    return this.service
      .get(`/spaces/${id}`)
      .then(space => {
        console.log(space.data.likes)
        this.setState({ image: space.data.image, mediaIDs: space.data.media, likes:space.data.likes, owner: space.data.creator });
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
    this.props.newPage();
  }; 

  init = ({ camera, scene, renderer, sceneCSS, rendererCSS }) => {
    this.setState({ controls: new DeviceOrientationControls(camera) });
    //this.setState({ controls: new TrackballControls(camera) });

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
    let likes = this.state.likes;
    if(media!==undefined){
      group = CSS3elements (this.state.spaceRadius, media, likes);
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

  toogleModal = (event) => { 
    if (this.state.modal){
      this.setState({modal: false});
      this.setState({menu: "MEDIA"});
    } else{
      this.setState({modal: true});
      this.setState({menu: "MEDIA"});
    }
  }

  mediaMenu = (event, menu)=>{
      this.setState({menu: menu});
  }

  likeListener = () => {
      document.body.addEventListener("click", e => {
        if(e.target.id == "like-button"){
          let likes = this.state.likes + 1;
          this.setState({likes: likes});
          console.log(likes);
          let space = {likes:likes, id: this.state.spaceID/* , usersWhoLiked: this.state.loggedInUser */}
          return this.service.post("/spaces/like", {space})
          .then(space => {
            console.log("Space updated on DB " + space.data);
          })
          .catch(error => console.log(error));
        }
      });
  }

  componentDidMount = () => {
    let id =  this.props.match.params.id;
    this.setState({spaceID: id});
    geolocalize().then(center => {
      this.setState({currrentLocation: center});
    });
    this.getImage(id).then(() => {
      this.init(this.state);
      this.animate();
    }).then(()=>{
      this.likeListener();
    })
  };

  render() {
    let id =  this.props.match.params.id;
    let likes = this.state.likes;

    if (this.state.loggedInUser){
      let isOwner = (this.state.owner == this.state.loggedInUser._id);

      console.log(this.state.modal)
      console.log(this.state.menu)

      if(isOwner && !this.state.modal){
        return (
          <div id="scopediv">
              <button className="button is-white is-outlined is-rounded switch-button white"><Link to={`/camera/${id}`}>AR</Link></button>
              <button className="button is-white is-outlined is-rounded likes-button white" onClick={ e => this.toogleModal(e)}>Add Media</button>
          </div>
        )
      } 
      else if (isOwner && this.state.modal && this.state.menu == "IMAGE"){
        return (
          <div>
            <div className="card box modal">
              <UploadMediaImg userInSession={this.state.loggedInUser} currentSpace={this.state.spaceID}/>
            </div>
            <div id="scopediv">
                <button className="button is-white is-outlined is-rounded switch-button white"><Link to={`/camera/${id}`}>AR</Link></button>
                <button className="button is-white is-outlined is-rounded likes-button white" onClick={ e => this.toogleModal(e)}>Add Media</button>
            </div>
          </div>
        )
      } else if (isOwner && this.state.modal && this.state.menu == "TEXT"){
        return (
          <div> 
            <div className="card box modal">
              <UploadMediaText userInSession={this.state.loggedInUser} currentSpace={this.state.spaceID}/>
            </div>
            <div id="scopediv">
                <button className="button is-white is-outlined is-rounded switch-button white"><Link to={`/camera/${id}`}>AR</Link></button>
                <button className="button is-white is-outlined is-rounded likes-button white" onClick={ e => this.toogleModal(e)}>Add Media</button>
            </div>
          </div>
        )
      } else if (isOwner && this.state.modal && this.state.menu == "VIDEO"){
        return (
          <div>
            <div className="card box modal">
              <UploadMediaVideo userInSession={this.state.loggedInUser} currentSpace={this.state.spaceID}/>
            </div>
            <div id="scopediv">
                <button className="button is-white is-outlined is-rounded switch-button white"><Link to={`/camera/${id}`}>AR</Link></button>
                <button className="button is-white is-outlined is-rounded likes-button white" onClick={ e => this.toogleModal(e)}>Add Media</button>
            </div>
          </div>
        )
      }
      else if(isOwner && this.state.modal && this.state.menu == "MEDIA"){
        return (
          <div>
            <div className="card box modal">
              <button className="button is-primary" onClick={ e => this.mediaMenu(e, "TEXT")}>Add Text</button>
              <button className="button is-primary" onClick={ e => this.mediaMenu(e, "IMAGE")}>Add Image</button>
              <button className="button is-primary" onClick={ e => this.mediaMenu(e, "VIDEO")}>Add Video</button>
            </div>
            <div id="scopediv">
              <button className="button is-white is-outlined is-rounded likes-button white" onClick={ e => this.toogleModal(e)}>Add Media</button>
              <button className="button is-white is-outlined is-rounded switch-button white"><Link to={`/camera/${id}`}>AR</Link></button>
            </div>
          </div>
        )
      }
    }
    
    return (
      <div>
        <div id="scopediv">
            <button className="button is-white is-outlined is-rounded switch-button white"><Link to={`/camera/${id}`}>AR</Link></button>
            <button className="button is-white is-outlined is-rounded likes-button white" disabled>{likes} likes</button>
        </div>
      </div>
    );
  }
}
