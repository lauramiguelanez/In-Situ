// auth/Signup.js
import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import AuthService from "./AuthService";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { username: "", password: "", redirect: false };
    this.service = new AuthService();
  }

  handleFormSubmit = event => {
    event.preventDefault();
    const username = this.state.username;
    const password = this.state.password;

    this.service
      .login(username, password)
      .then(response => {
        this.setState({
          username: username,
          password: password,
          error: false,
          redirect: true
        });

        this.props.getUser(response);
      })
      .catch(error => {
        this.setState({
          username: username,
          password: password,
          error: true
        });
      });
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {

    if(this.state.redirect) return <Redirect to="/" />

    return (
      <div className="card box">
        <h3 className="label is-medium">Please, login</h3>
        <form onSubmit={this.handleFormSubmit} >

          <div className="field">
            <label className="label">Username:</label>
            <input
              className="input"
              type="text"
              name="username"
              value={this.state.username}
              onChange={e => this.handleChange(e)}
            />
          </div>

          <div className="field">
            <label className="label">Password:</label>
            <input
              className="input"
              type="password"
              name="password"
              value={this.state.password}
              onChange={e => this.handleChange(e)}
            />
          </div>

          <input className="button is-primary is-rounded" type="submit" value="Login" />

        </form>

        <h1>{this.state.error ? "Error" : ""}</h1>

        
      </div>
    );
  }
}

export default Login;

