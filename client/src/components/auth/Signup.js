// auth/Signup.js
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import AuthService from './AuthService'

class Signup extends Component {
  constructor(props){
    super(props);
    this.state = { username: '', password: '', redirect: false };
    this.service = new AuthService();
  }
    
  handleFormSubmit = (event) => {
    event.preventDefault();
    const username = this.state.username;
    const password = this.state.password;

    this.service.signup(username, password)
    .then( response => {
        this.setState({
            username: "", 
            password: "",
            redirect: true
        });
        this.props.getUser(response.user)
    })
    .catch( error => console.log(error) )
  }

  handleChange = (event) => {  
    const {name, value} = event.target;
    this.setState({[name]: value});
  }
      

  render() {
    if(this.state.redirect) return <Redirect to="/" />


    return(
      <div className="card box">
        <h3 class="label is-medium">Welcome! create your account next:</h3>

        <form onSubmit={this.handleFormSubmit}>
          <div className="field">
            <label className="label">Username:</label>
            <input className="input" type="text" name="username" value={this.state.username} onChange={ e => this.handleChange(e)}/>
          </div>
          
          <div className="field">
            <label className="label">Password:</label>
            <input  className="input" type="password" name="password" value={this.state.password} onChange={ e => this.handleChange(e)} />
          </div>
          
          <input className="button is-primary is-rounded" type="submit" value="Sign up" />
        </form>

      </div>
    )
  }
}

export default Signup;