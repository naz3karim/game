var express = require('express');
var router = express.Router();
const User = require("../models/users")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = "jwtSecret"
var session = require('express-session')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let  u = await User.find()
  return res.json(u)
});

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  User.findOne(
      { username: req.body.username }
    ).then(user =>  {
      if(user){
        return res.json({success: false, message: "Username Already Exist"})
      }else{
        const newUser = new User({
          password: req.body.password,
          username:  req.body.username,
          name:  req.body.name,
        });
    
        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) =>{

          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err)throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                let payload = {
                  username: user.username,
                  name: user.name
                };
                jwt.sign(
                  payload,
                  keys,
                  {
                    expiresIn: 31556926 // 1 year in seconds
                  },
                  (err, token) => {
                    user.token = token
                    user.save().then( u=>{
                      req.session.loggedIn=true
                      req.session.name=user.name
                      return res.json({success: true,
                        token: 'Bearer ' + token,
                      });
                    }).error(err => {
                      return res.json({success: false,
                        message: "Internal Server Error"
                      });
                    })
                    
                  }
                );
              })
              .catch(err => console.log(err));
          });
        })


      }
    })
    
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  // Find user by email
  User.findOne({ username: username }).then(user => {
    // Check if user exists
    if (!user) {
      return res.json({ success: false,message: "Username not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        let payload = {
          username: user.username,
          name: user.name
        };

        // Sign token
        jwt.sign(
          payload,
          keys,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            user.token = token
            user.save().then( u=>{
              req.session.loggedIn=true
              req.session.name=user.name
              return res.json({success: true,
                token: 'Bearer ' + token,
              });
            }).error(err => {
              return res.json({success: false,
                message: "Internal Server Error"
              });
            })
            
          }
        );
      }else{
        return res.json({success: false,
          message: "Wrong Password"
        });
      }
    });
  });
});


module.exports = router;
