const mongoose = require("mongoose");
const config = require("../config/index");

const connect = () => {
  mongoose.connect(config.MONGODB_URL, {}, (e) => {
    if (e) {
      console.log("Error Occured " + e.message);
      process.exit(1);
    }
    console.log("MONGODB CONNECTED SUCESSFULLY");
  });
};

module.exports = connect;
