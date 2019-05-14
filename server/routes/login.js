const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const app = express();
const unauthorizedError = {
  err: {
    message: "Incorrect user or password"
  }
};

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err) return res.status(500).json(err);

    if (!user) {
      return res.status(400).json(unauthorizedError);
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json(unauthorizedError);
    }

    const token = jwt.sign({ user }, process.env.TOKEN_SEED, {
      expiresIn: process.env.TOKEN_EXPIRATION
    });

    res.status(200).json({ user, token });
  });
});

module.exports = app;
