const express = require('express');
require("dotenv").config();
var axios = require("axios");

let instaKey = process.env.INSTAGRAM_API_KEY
let instaUrl = "https://api.instagram.com/v1";




const instagram = (location) => {

let locationId;
let {lat, lng} = location;
/* let lat=48.858844
let lng=2.294351 */

    axios
    .get(`${instaUrl}/locations/search?lat=${lat}&lng=${lng}&access_token=${instaKey}`, {
    })
    .then(response => {
        locationId = response.data[0].id;
        console.log(locationId);
    })

return axios
    .get(`${instaUrl}/locations/{location-id}?access_token=${instaKey}`, {
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey
      }
    })
    .then(response => {
      console.log(response);
    })


}




module.exports = instagram;