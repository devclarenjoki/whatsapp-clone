const { asyncHandler } = require("../../middlewares/errorHandlers");

const Message = require("../../models/Message");
const User = require("../../models/User");

let message = (module.exports = {});
const mongoose = require("mongoose");

// Fetch the user's chat list
message.fetchMessages = asyncHandler(async (req, res, next) => {
  req.body.user = mongoose.Types.ObjectId(req.body.user);
  // Check if room already exits
  const messages = await Message.find({
    $or: [
      {
        user: req.params.userId,
      },
      {
        to: req.params.userId,
      },
    ],
  }).populate("user to", "name online lastSeen");

  res.send(messages);
});

// Send a new message
message.send = asyncHandler(async (req, res, next) => {
  req.body.user = mongoose.Types.ObjectId(req.body.user);
  req.body.to = mongoose.Types.ObjectId(req.body.to);
  // Check if room already exits
  const roomExists = await Message.findOne({
    $or: [
      {
        $and: [{ user: req.body.user }, { to: req.body.to }],
      },
      {
        $and: [{ user: req.body.to }, { to: req.body.user }],
      },
    ],
  });

  // If room exits, then append the message to the room
  if (roomExists) {
    const pushedMessage = await Message.findOneAndUpdate(
      {
        $or: [{ user: req.body.user }, { to: req.body.user }],
      },
      {
        $addToSet: {
          chats: { user: req.body.user, message: req.body.message },
        },
      }
    ).populate("user", "name");

    res.send(pushedMessage);
  }
  // If not, create a room and append the message
  else {
    var data = {
      user: req.body.user,
      to: req.body.to,
      chats: [
        {
          user: req.body.user,
          message: req.body.message,
        },
      ],
    };
    const newRoom = new Message(data);
    const savedRoom = await newRoom.save();

    res.send(savedRoom);
  }
});

// Get the chats list
message.sync = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({
    $or: [{ user: req.params.userId }, { to: req.params.userId }],
  })
    .populate("user", "name online lastSeen")
    .populate("to", "name online lastSeen");

  res.send(messages);
});
