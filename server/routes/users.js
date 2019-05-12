const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const User = require("../models/user");

const app = express();

app.get("/users", (req, res) => {
  const startAt = Number(req.query.startAt) || 0;
  const limit = Number(req.query.limit) || 5;

  User.find({ status: true }, "name email role status google")
    .skip(startAt)
    .limit(limit)
    .exec((err, users) => {
      if (err) {
        return res.status(400).json(err);
      }

      User.countDocuments({ status: true }, (err, length) => {
        res.json({
          ok: true,
          users,
          length
        });
      });
    });
});

app.post("/users", (req, res) => {
  const body = req.body;

  const user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  user.save((err, userDB) => {
    if (err) {
      return res.status(400).json(err);
    }

    res.json({
      ok: true,
      user: userDB
    });
  });
});

app.put("/users/:id", (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ["name", "email", "img", "role", "status"]);

  User.findByIdAndUpdate(
    id,
    body,
    { new: true, runValidators: true },
    (err, userDB) => {
      if (err) {
        return res.status(400).json(err);
      }

      res.json({
        ok: true,
        user: userDB
      });
    }
  );
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  User.findByIdAndUpdate(id, { status: false }, { new: true }, (err, user) => {
    if (err) {
      return res.status(400).json(err);
    }

    if (!user) {
      return res.status(400).json({
        ok: false,
        error: "User not found"
      });
    }

    res.json({
      ok: true,
      user
    });
  });
});

module.exports = app;
