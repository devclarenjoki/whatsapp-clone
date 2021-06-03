const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Message = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  chats: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      message: String,
      time: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});
var message = mongoose.model("message", Message);
module.exports = message;
