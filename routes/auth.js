//sare authenticaltion related end points yaah pe
const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "yash is great";
var fetchuser=require('../middleware/fetchUser')

//  ROUTE 1
//create a user using :POST "/api/auth/createuser", no login required
router.post(
  //changed get to post - because we didn't want to get request seen on url
  "/createuser",
  [
    body("email").isEmail(),
    body("name", "enter a valid name").isLength({ min: 3 }),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //new way of creating - by express validator,if there are errors,return bad request and the errors
    const errors = validationResult(req);
    let success=false;
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    try {
      //check wether the user with this email exist already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({success, error: "Sorry a user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //create a user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.send({success, authtoken });
      //   console.log(authtoken);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error occured");
    }
    // .then(user=>res.json(user))
    //     .catch(err=>{console.log(err)}) //to send response in case of error
    //     res.json({eroor:'Please enter a unique value for email'})
  }
);

//  ROUTE 2
//login a user :POST "/api/authlogin", no login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    //if there are errors,return bad request and the errors
    const errors = validationResult(req);
    let success=false;
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({success, error: "Please try to login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password); //returns true or false
      if (!passwordCompare) {
        return res
          .status(400)
          .json({success, error: "Please try to login with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      success=true;
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.send({success,authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server Error occured");
    }
  }
);

//  ROUTE 3
//get loggedin user details  :POST "/api/auth/getuser", login required
router.post(
  "/getuser",fetchuser, async (req, res) => { //fetchuser is a middleware
    try {
      var userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      //get all details of user except password
      res.send(user)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
module.exports = router;
