const Joi = require("@hapi/joi");

// User Validation
const userRegisterAuth = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  userRegisterAuth,
};
