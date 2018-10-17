const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Catalog = require('../models/Catalog');
const passport = require('passport');


const login = (req, user) => {
  return new Promise((resolve,reject) => {
    req.login(user, err => {
      console.log('req.login ')
      console.log(user)

      if(err) {
        reject(new Error('Something went wrong'))
      }else{
        resolve(user);
      }
    })
  })
}

// SIGNUP
router.post('/signup', (req, res, next) => {
  let newUserId = "";
  const {username, password} = req.body;

  console.log('username', username)
  console.log('password', password)

  // Check for non empty user or password
  if (!username || !password){
    next(new Error('You must provide valid credentials'));
  }
  
  // Check if user exists in DB
  User.findOne({ username })
  .then( foundUser => {
    if (foundUser) throw new Error('Username already exists');

    const salt     = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    return new User({
      username,
      password: hashPass
    }).save();
  })
  .then( savedUser => login(req, savedUser)) // Login the user using passport
  .then( user => {
    newUserId = user._id;
    res.json({status: 'signup & login successfully', user}); // Answer JSON
    return new Catalog({
      userId: newUserId
    }).save();
  }) 
  .then( savedCatalog => {
    console.log("NEW USER ID " + newUserId);
    return User.findByIdAndUpdate(newUserId, {catalog: savedCatalog._id}, {new:true}); 
  })
  .then( user => console.log(user))
  .catch(e => next(e));
});

//LOGIN
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    
    // Check for errors
    if (err) next(new Error('Something went wrong')); 
    if (!theUser) next(failureDetails)

    // Return user and logged in
    login(req, theUser).then(user => res.status(200).json(req.user));

  })(req, res, next);
});

//GET LOGGEDINUSER
router.get('/currentuser', (req,res,next) => {
  if(req.user){
    res.status(200).json(req.user);
  }else{
    next(new Error('Not logged in'))
  }
})

//GET OTHER USERS
router.get('/:id',(req,res,next) => {
  const {id} = req.params;
  User.findById({id})
      .then( obj => res.status(200).json(obj))
      .catch(e => next(e))
})

router.get('/user/:username',(req,res,next) => {
  const {username} = req.params;
  console.log(username);
  User.findOne({username: username})
      .then( obj => res.status(200).json(obj))
      .catch(e => next(e))
})

router.get('/logout', (req,res) => {
  console.log("TRYING LOGOUT AT BACK");
  req.logout();
  res.status(200).json({message:'logged out'})
});


router.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
})

module.exports = router;
