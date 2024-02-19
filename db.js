const mongoose = require("mongoose");
require("dotenv").config();

const connectToMongo = () => {
  mongoose
    .connect(process.env.MONGODB_CONNECTION_STRING)
    .then(console.log("Connected To MongoDB"))
    .catch((error) => console.log("Error: ", error.message));
};

module.exports = connectToMongo;
