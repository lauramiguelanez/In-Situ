import React, { Component } from "react";
import { Switch, Route } from 'react-router-dom';

//import "bulma/css/bulma.css";
import "./App.scss";

import Navbar from './components/Navbar';
import AuthService from "./components/auth/AuthService";
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';

import { ScopeView } from "./components/ScopeView";
import { UploadSpace } from "./components/UploadSpace";

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedInUser: null,
      spaceId: "5bbfae0bcd9bc63679416c92"
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

  actualizeSpace = space => {
    this.setState({ spaceId: space });
  };

  render() {
    this.fetchUser();

    if (this.state.loggedInUser) {
      return (
        <div className="App">
          <header className="header">
            <Navbar userInSession={this.state.loggedInUser} logout={this.logout} />
            <h1>Welcome to Scope</h1>
          </header>
          <UploadSpace newEspace={space => {this.actualizeSpace(space)}} userInSession={this.state.loggedInUser}/>
          <ScopeView id={this.state.spaceId} />
        </div>
      );
    } else {
      return (
        <div className="App">
          <header className="header">
            <Navbar userInSession={this.state.loggedInUser} logout={this.logout} />
            <h1>Welcome to Scope</h1>
            <Switch>
              <Route exact path='/signup' render={() => <Signup getUser={this.getTheUser}/>}/>
              <Route exact path='/login' render={() => <Login getUser={this.getTheUser}/>}/>
            </Switch>
          </header>
          <ScopeView id={this.state.spaceId} />
        </div>
      );
    }
  }
}

export default App;
