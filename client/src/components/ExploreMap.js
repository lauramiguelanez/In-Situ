import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import axios from "axios";
import geolocalize from "./maps/geolocalize";
import Map from './maps/Map';


export class ExploreMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        };
        this.service = axios.create({
          baseURL: `${process.env.REACT_APP_API_URL}/api`
        });
      }

      componentWillMount(){
        geolocalize().then(center => {
            console.log(center);
            this.setState({location: center});
          });
        this.getMarkers();
      }
      setRedirect = (marker) => {
        this.setState({
          redirect: true,
          url: marker
        })
      }

      getMarkers =()=>{
          this.service.get("/spaces")
          .then(spaces=>{
            this.setState({spaces: spaces.data});
          })
      }

      renderRedirect = () => {
        if (this.state.redirect) {
            console.log(this.state.url)
            let url = `/scope/${this.state.url}`;
          return <Redirect to={url} />
        }
      }

    render(){
        let spaces = this.state.spaces;
        console.log(spaces);
        return(
            <div>
            {this.renderRedirect()}
            <Map id="myMap" options={{center: this.state.location, zoom: 12}} 
          onMapLoad={map => {
            let markers=[];
            spaces.forEach(space=>{
                let  marker = new window.google.maps.Marker({
                position: space.location, map: map,
                icon: "./marker.png",
                url: space._id,
                title: 'Scope near you!'
                });
                markers.push(marker);
            })
            markers.forEach(marker=>{
                marker.addListener('click', e => {
                    this.setRedirect(marker.url)
                    console.log(marker.url)
                  })
            })
          }} 
        />
        </div>
        )
    }


}