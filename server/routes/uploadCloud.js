const express = require('express');
const router  = express.Router();
const uploadCloud = require("../config/cloudinary.js");

router.post("/", uploadCloud.single("photo"), (req, res, next) => {
    console.log("UPLOADING TO CLOUDINARY");
    //console.log("The body: " + req.body);
    //console.log("The file: " + req.file);
    let resImage = res.json(req.file);
    console.log(resImage);
  });
  
  module.exports = router;