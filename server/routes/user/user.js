const bycrypt = require("bcryptjs");
const createError = require("http-errors");
const config = require("../../config/config.json")[
  process.env.NODE_ENV || "development"
];
const { asyncHandler } = require("../../middlewares/errorHandlers");

let user = (module.exports = {});
const User = require("../../models/User");
const { userRegisterAuth } = require("../../validators/validation");

// Create a new user
user.create = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const validate = userRegisterAuth.validateAsync(req.body);

  // Check user already exists or not
  const doesUserExists = await User.find({ email: email });

  if (doesUserExists.length !== 0)
    throw createError.Conflict("User Already Exists");

  // Hash Password
  bycrypt.genSalt(10, (err, salt) => {
    bycrypt.hash(password, salt, async (err, hashedPassword) => {
      if (err) throw err;
      req.body.password = hashedPassword;
      // Save the user
      const user = new User(req.body);
      const savedUser = await user.save();
      savedUser.password = undefined; // remove password from the user object
      res.status(201);
      res.send(savedUser);
    });
  });
});

// Update online status
user.updateOnlineStatus = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findOneAndUpdate({
    _id: req.body.userId,
    online: true,
  });
  res.status(200);
  res.send(updatedUser);
});

// Update offline status
user.updateOfflineStatus = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findOneAndUpdate({
    _id: req.body.userId,
    online: false,
    lastSeen: Date.now(),
  });
  res.status(200);
  res.send(updatedUser);
});
