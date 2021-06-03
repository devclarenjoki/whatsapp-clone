const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const mongoose = require("mongoose");
const Pusher = require("pusher");
const routes = require("./routes/");
const {
  errorHandler,
  initUnhandledExceptions,
} = require("./middlewares/errorHandlers");
const message = require("./models/Message");

require("./intializers/DBInitializer");

const pusher = new Pusher({
  appId: "<>",
  key: "<>",
  secret: "<>",
  cluster: "<>",
  encrypted: true,
});

const db = mongoose.connection;

db.once("open", () => {
  const msgCollection = db.collection("messages");
  const changeStream = msgCollection.watch();
  changeStream.on("change", (change) => {
    // New Chat
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", messageDetails);
    } else {
      console.log("error triggering pusher");
    }
    // Update chats
    if (change.operationType === "update") {
      const messageDetails = change;
      pusher.trigger("messages", "updated", {
        _id: messageDetails.documentKey._id,
        messages: messageDetails.updateDescription.updatedFields.chats,
      });
    } else {
      console.log("error triggering pusher");
    }
  });
});

// Rate Limiter
const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(express.json());
app.use(cors());
app.use(limiter);
app.use(xss()); // santize body, params, url
app.use(hpp()); // To prevent HTTP parameter pollution attack
app.use(helmet()); // To secure from setting various HTTP headers
app.use(mongoSanitize());

// log only 4xx and 5xx responses to console
app.use(
  morgan("dev", {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  })
);

// Routes
app.use("/api/v1", routes);

// Error Handlers
app.use(errorHandler);

// Unhandled Exceptions and rejections handler
initUnhandledExceptions();

// Run server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
