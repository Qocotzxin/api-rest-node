const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const User = require("../models/user");
const { tokenVerify, adminVerify } = require("../middlewares/authentication");

const app = express();

/**
 * Get list of users
 */
app.get("/users", tokenVerify, (req, res) => {
  const startAt = Number(req.query.startAt) || 0;
  const limit = Number(req.query.limit) || 5;

  User.find({ status: true }, "name email role status google")
    .skip(startAt)
    .limit(limit)
    .exec((err, users) => {
      if (err) return res.status(400).json(err);

      User.countDocuments({ status: true }, (err, length) => {
        if (err) return res.status(500).json(err);

        res.json({ users, length });
      });
    });
});

/**
 * Creates new user
 */
app.post("/users", [tokenVerify, adminVerify], (req, res) => {
  const { name, email, role, password } = req.body;

  const user = new User({
    name: name,
    email: email,
    password: bcrypt.hashSync(password, 10),
    role: role
  });

  user.save((err, user) => {
    if (err) return res.status(400).json(err);

    res.json({ user });
  });
});

/**
 * Updates user information
 */
app.put("/users/:id", [tokenVerify, adminVerify], (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ["name", "email", "img", "role", "status"]);

  User.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, user) => {
      if (err) return res.status(400).json(err);

      res.json({ user });
    }
  );
});

/**
 * Deactivates a user
 */
app.delete("/users/:id", [tokenVerify, adminVerify], (req, res) => {
  const id = req.params.id;

  User.findByIdAndUpdate(id, { status: false }, { new: true }, (err, user) => {
    if (err) return res.status(400).json(err);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    res.json({ user });
  });
});

module.exports = app;
