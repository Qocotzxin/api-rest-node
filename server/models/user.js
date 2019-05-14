const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const userRoles = {
  values: ['ADMIN', 'USER'],
  message: '{VALUE} it not a valid role'
}

const Schema = mongoose.Schema;

/**
 * User schema
 */
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is mandatory"]
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is mandatory"]
  },
  password: {
    type: String,
    required: [true, "Password is mandatory"]
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: "USER",
    enum: userRoles
  },
  status: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
});

/**
 * Avoids returning password in responses
 */
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
}

/**
 * Sets plugin to validate unique fields
 */
userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique.' });

module.exports = mongoose.model("User", userSchema);
