const mongoose = require("mongoose");
const config = require("../config/config.json")[
  process.env.NODE_ENV || "development"
];

// MongoDB Connection
mongoose
  .connect(config.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(() => {
    console.log("MongoDB Connection Error");
  });
