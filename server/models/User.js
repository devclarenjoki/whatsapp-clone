const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  name: String,
  password: String,
  email: String,
  online: { type: Boolean, default: false },
  lastSeen: {
    type: Date,
  },
});

var user = mongoose.model("user", User);
module.exports = user;
