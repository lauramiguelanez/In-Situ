import React, { Component } from "react";
import { Switch, Route } from 'react-router-dom';


import "./App.scss";

import Navbar from './components/Navbar';
import AuthService from "./components/auth/AuthService";
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';

import { ScopeView } from "./components/ScopeView";
import { UploadSpace } from "./components/upload/UploadSpace";
import { UploadMediaImg} from "./components/upload/UploadMediaImg";
//import Map from './components/maps/Map';
import { ScopeCamera } from "./components/3dSpace/ScopeCamera";
import { ScopeCameraID } from "./components/3dSpace/ScopeCameraID";
import { UploadMediaVideo } from "./components/upload/UploadMediaVideo";
import BottomMenu from "./components/BottomMenu";
import Profile from "./components/Profile";
import ProfileID from "./components/ProfileID";
import { ScopeID } from "./components/3dSpace/ScopeID";
import { Welcome } from "./components/3dSpace/Welcome";

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedInUser: null,
      spaceId: "5bc3313fdd315804e045a573",
      spaceLocation: {lat: 40.3923451, lng: -3.6985332999999994}
    };
    this.service = new AuthService();
  }

  getTheUser = userObj => {
    this.setState({
      loggedInUser: userObj
    });
  };

  logout = () => {
    this.service.logout().then(() => {
      this.setState({ loggedInUser: null });
    });
  };

  fetchUser() {
    if (this.state.loggedInUser === null) {
      this.service
        .loggedin()
        .then(response => {
          this.setState({
            loggedInUser: response
          });
        })
        .catch(err => {
          this.setState({
            loggedInUser: false
          });
        });
    }
  }

  actualizeSpace = (space, location) => {
    this.setState({ spaceId: space, spaceLocation: location });
  };

  render() {
    console.log("SPACE ID STATE!!!!!!!!")
    console.log(this.state.spaceId)
    this.fetchUser();
    return (
      <div className="App">
        <header className="header">
          <Navbar userInSession={this.state.loggedInUser} logout={this.logout} />
        </header>
        <div className="fix-top"></div>
        <main>
          <Switch>
            <Route exact path='/' render={() => <Welcome/> }/>  
            <Route exact path='/signup' render={() => <Signup getUser={this.getTheUser}/>}/>
            <Route exact path='/login' render={() => <Login getUser={this.getTheUser}/>}/>
            <Route path='/profile/:username' render={(props) => <ProfileID {...props}/>}/>
            <Route exact path='/profile' render={() => <Profile userInSession={this.state.loggedInUser}/>}/>
            <Route path='/scope/:id' render={(props) => <ScopeID newSpace={(space, location) => {this.actualizeSpace(space, location)}} {...props}/>} newSpace={(space, location) => {this.actualizeSpace(space, location)}}/>
            <Route exact path='/scope' render={() => <ScopeView id={this.state.spaceId}/>}/>
            <Route exact path='/camera/:id' render={(props) => <ScopeCameraID newSpace={(space, location) => {this.actualizeSpace(space, location)}} {...props}/>}/>
            <Route exact path='/camera' render={() => <ScopeCamera id={this.state.spaceId}/>}/>
            <Route exact path='/upload-scope' render={() => <UploadSpace newSpace={(space, location) => {this.actualizeSpace(space, location)}} userInSession={this.state.loggedInUser}/>}/>
            <Route exact path='/upload-media-img' render={() => <UploadMediaImg userInSession={this.state.loggedInUser} currentSpace={this.state.spaceId}/>}/>
            <Route exact path='/upload-media-video' render={() => <UploadMediaVideo userInSession={this.state.loggedInUser} currentSpace={this.state.spaceId}/>}/>
          </Switch>
        </main>
        <div className="fix-bottom"></div>
        <footer>
            <BottomMenu userInSession={this.state.loggedInUser}/>
        </footer>
        {/* <Map id="myMap" options={{center: this.state.spaceLocation, zoom: 8}} 
          onMapLoad={map => {
            let marker = new window.google.maps.Marker({
            position: this.state.spaceLocation, map: map,
            title: 'Hello Istanbul!'
            });
          }} 
        />*/}
      </div>
    );
  }
}
export default App;
