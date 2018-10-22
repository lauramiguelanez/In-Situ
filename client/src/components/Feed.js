import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
require('dotenv').config();

export default class Feed extends Component {
    constructor(props) {
      super(props);
      this.state = {
      };
      this.service = axios.create({
        baseURL: `${process.env.REACT_APP_API_URL}/api`
      });
    }

    
}