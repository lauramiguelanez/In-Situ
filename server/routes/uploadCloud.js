const express = require('express');
const router  = express.Router();
const uploadCloud = require("../config/cloudinary.js");

router.post("/", uploadCloud.single("photo"), (req, res, next) => {
    console.log("UPLOADING TO CLOUDINARY");
    console.log("The body: " + req.body);
    console.log("The file: " + req.file);
    res.json(req.file)
  });
  
  module.exports = router;