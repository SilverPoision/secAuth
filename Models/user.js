const mongo = require("mongoose");

const userSchema = new mongo.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 10,
    max: 525,
  },
  resetPasswordToken: {
    type: String,
    required: false,
  },
  resetPasswordExpires: {
    type: Date,
    required: false,
  },
  emailVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  emailToken: {
    type: String,
  },
  sessToken: [
    {
      type: String,
      default: null,
    },
  ],
});

module.exports = mongo.model("User", userSchema);
