const express = require("express");
const Users = require("../Schema/User/UserSchema");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

//Endpoint for registering the user
router.post("/signup", async (req, res) => {
  //checking user email is already exsist or not
  let checkUserEmail = await Users.findOne({ email: req.body.email });

  if (checkUserEmail) {
    return res
      .status(400)
      .json({ success: false, error: "User with this email already exsist" });
  } else {
    //creating cart object
    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    const user = new Users({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      cartData: cart,
    });

    await user.save();
    const data = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(data, process.env.JWT_SALT);
    res.json({
      success: true,
      token,
    });
  }
});

//Endpoint for user login
router.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });

  if (user) {
    const passwordCompare = req.body.password === user.password;
    if (passwordCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, process.env.JWT_SALT);
      res.json({
        success: true,
        token,
      });
    } else {
      res.json({ success: false, error: "Wrong Credentials" });
    }
  } else {
    res.json({ success: false, error: "No User Found with this credentials" });
  }
});

module.exports = router;
