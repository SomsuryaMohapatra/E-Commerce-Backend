const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const connectToMongo = require("./db");

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());

//Database Connection with MongoDB
// const mongoConnectionURL =
//   "mongodb+srv://learndev:ecommerce_learndev@cluster0.gzedqtc.mongodb.net/e-commerce";
// mongoose.connect(mongoConnectionURL);
connectToMongo();

//API creation
app.get("/", (req, res) => {
  res.send("Express App is running");
});

//Product endpoints
app.use("/api", require("./routes/product"));

//Image Storage Engine using multer
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

//Endpoint for accessing uploaded image
app.use("/images", express.static("upload/images"));

//Creating Endpoint for Upload Images
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${PORT}/images/${req.file.filename}`,
  });
});

//

// Start the server
app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server running on Port: ", PORT);
  } else {
    console.log("Error: ", error);
  }
});
