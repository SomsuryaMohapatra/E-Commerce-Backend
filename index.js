const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const PORT = 4000;
const app = express();
app.use(express.json());
app.use(cors());

//Database Connection with MongoDB
const mongoConnectionURL =
  "mongodb+srv://learndev:ecommerce_learndev@cluster0.gzedqtc.mongodb.net/e-commerce";
mongoose.connect(mongoConnectionURL);

//API creation

app.get("/", (req, res) => {
  res.send("Express App is running");
});

app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server running on Port: ", PORT);
  } else {
    console.log("Error: ", error);
  }
});
