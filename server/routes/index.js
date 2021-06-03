const express = require("express");
const router = express.Router();
const message = require("./message/message");
const user = require("./user/user");

router
  .post("/user/create", user.create)
  .post("/user/updateOnlineStatus", user.updateOnlineStatus)
  .post("/user/updateOfflineStatus", user.updateOfflineStatus);

router
  .post("/message/send", message.send)
  .get("/message/sync/:userId", message.sync)
  .get("/message/fetchMessages/:userId", message.fetchMessages);

module.exports = router;
