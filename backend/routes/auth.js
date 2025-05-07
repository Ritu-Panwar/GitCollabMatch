const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = process.env.JWT_SECRET;

//Route 1: Create a user using POST "/api/auth", No auth required
router.post("/createUser",[
    body('name', "Enter a valid name").isLength({ min: 3 }),
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password must be atleast 5 characters").isLength({ min: 5 })
], async(req, res)=>{
  let success = false;
     // Finds the validation errors in this request and wraps them in an object with handy functions
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({success, errors: errors.array() });
     }
   
     try {
    // Check whether the user with this email exists already
    let user = await User.findOne({email: req.body.email});
    if(user)
    {
      return res.status(400).json({success, error: "Sorry! User with this email already exists"});
    }
    // Create a user
    const salt = await bcrypt.genSalt(10);
    const secpsswd = await bcrypt.hash(req.body.password, salt);
    
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secpsswd,
      });
      //Verify with the users id
      const data = {
        user:{
          id: user.id
        }
      }
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authToken});

     } catch (error) {
        console.error(error.message);
        res.status(500).send({error: "Internal Server Error"});
     }
});

//Route 2: Authenticate a user using POST "/api/auth", No auth required
router.post("/login", [
  body('email').isEmail(),
  body('password').isLength({ min: 5 })
], async (req, res) => {
  let success = false;

  // Find validation errors in this request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
    }

    // Compare the user's passwords
    let passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
    }

    // Create the payload for JWT
    const data = {
      user: {
        id: user.id,
        email: user.email // Optionally include email or any other data you need
      }
    };
    const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: '1h' }); // Optionally set expiration time
    success = true;

    // Return the response with the token and user info
    res.json({ success, authToken, user: { _id: user._id, email: user.email } });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

//Decode jwt token
router.post("/getUser",fetchuser, async(req, res)=>{
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({error: "Internal Server Error"});
  }
});

module.exports = router;