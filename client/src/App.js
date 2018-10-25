import React, { Component } from "react";
import { Switch, Route } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from "react-transition-group";

import "./App.scss";

import Navbar from './components/Navbar';
import AuthService from "./components/auth/AuthService";
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';

import { ScopeView } from "./components/ScopeView";
import { UploadSpace } from "./components/upload/UploadSpace";
import { UploadMediaImg} from "./components/upload/UploadMediaImg";
import { ScopeCamera } from "./components/3dSpace/ScopeCamera";
import { ScopeCameraID } from "./components/3dSpace/ScopeCameraID";
import { UploadMediaVideo } from "./components/upload/UploadMediaVideo";
import { UploadMediaText } from "./components/upload/UploadMediaText";
import BottomMenu from "./components/BottomMenu";
import Profile from "./components/Profile";
import ProfileID from "./components/ProfileID";
import { ScopeID } from "./components/3dSpace/ScopeID";
import { Welcome } from "./components/3dSpace/Welcome";
import Feed from "./components/Feed";
import { ExploreMap } from "./components/ExploreMap";

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedInUser: null,
      spaceId: "5bc3313fdd315804e045a573",
      spaceLocation: {lat: 40.3923451, lng: -3.6985332999999994},
      page: "Home"
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
    console.log("SPACE ID STATE APP")
    console.log(this.state.spaceId)
    this.fetchUser();
    return (
      <div className="App">
        <header className="header">
          <Navbar userInSession={this.state.loggedInUser} page ={this.state.page} logout={this.logout} />
        </header>
        <div className="fix-top"></div>
        <main>
          <Switch>
            <Route exact path='/' render={() => <Welcome/> }/>  
            <Route exact path='/feed' render={(props) => <Feed userInSession={this.state.loggedInUser} {...props}/>}/>
            <Route exact path='/explore' render={(props) => <ExploreMap location={this.state.spaceLocation} {...props}/>}/>
            <Route exact path='/signup' render={() => <Signup getUser={this.getTheUser}/>}/>
            <Route exact path='/login' render={() => <Login getUser={this.getTheUser}/>}/>
            <Route path='/profile/:username' render={(props) => <ProfileID userInSession={this.state.loggedInUser} {...props}/>}/>
            <Route exact path='/profile' render={() => <Profile userInSession={this.state.loggedInUser}/>}/>
            <Route path='/scope/:id' render={(props) => <ScopeID  userInSession={this.state.loggedInUser} newSpace={(space, location) => {this.actualizeSpace(space, location)}} {...props}/>}/>
            <Route exact path='/scope' render={() => <ScopeView id={this.state.spaceId}/>}/>
            <Route exact path='/camera/:id' render={(props) => <ScopeCameraID newSpace={(space, location) => {this.actualizeSpace(space, location)}} {...props}/>}/>
            <Route exact path='/camera' render={() => <ScopeCamera id={this.state.spaceId}/>}/>
            <Route exact path='/upload-scope' render={() => <UploadSpace newSpace={(space, location) => {this.actualizeSpace(space, location)}} userInSession={this.state.loggedInUser}/>}/>
            <Route exact path='/upload-media-img' render={() => <UploadMediaImg userInSession={this.state.loggedInUser} currentSpace={this.state.spaceId}/>}/>
            <Route exact path='/upload-media-video' render={() => <UploadMediaVideo userInSession={this.state.loggedInUser} currentSpace={this.state.spaceId}/>}/>
            <Route exact path='/upload-media-text' render={() => <UploadMediaText userInSession={this.state.loggedInUser} currentSpace={this.state.spaceId}/>}/>
          </Switch>
        </main>
        <div className="fix-bottom"></div>
        <footer>
            <BottomMenu userInSession={this.state.loggedInUser}/>
        </footer>
      </div>
    );
  }
}
export default App;
