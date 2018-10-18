// auth/auth-service.js
import axios from 'axios';
require('dotenv').config();

class AuthService {
  constructor() {
    this.service = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}/api/auth`,
      withCredentials: true
    });
  }

  signup = (username, password) => {
    return this.service.post('/signup', {username, password})
    .then(response => response.data)
  }

  login = (username, password) => {
    return this.service.post('/login', {username, password})
    .then(response => response.data)
  }

  loggedin = () => {
    return this.service.get('/currentuser',)
    .then(response => response.data)
    .catch(err => {
      console.error('Error in getUser', err)
    })
  }

  logout = () => {
    console.log("TRYING LOGOUT AT FRONT");
    return this.service.get('/logout',)
    .then(response => response.data)
  }
}

export default AuthService;