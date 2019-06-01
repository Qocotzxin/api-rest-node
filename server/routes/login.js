const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);
const app = express();

const unauthorizedError = {
  err: {
    message: "Incorrect user or password"
  }
};

const createToken = user => {
  return jwt.sign({ user }, process.env.TOKEN_SEED, {
    expiresIn: process.env.TOKEN_EXPIRATION
  });
};

async function verify(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID
  });
  const payload = ticket.getPayload();

  return {
    name: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  };
}
/**
 * Performs login operation and returns a token
 */
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err) return res.status(500).json(err);

    if (!user) return res.status(400).json(unauthorizedError);

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json(unauthorizedError);
    }

    const token = createToken();

    return res.status(200).json({ user, token });
  });
});

app.post("/google", async (req, res) => {
  const idtoken = req.body.idtoken;

  const googleUser = await verify(idtoken).catch(err =>
    res.status(403).json(err)
  );

  User.findOne({ email: googleUser.email }, (err, userDb) => {
    if (err) return res.status(500).json(err);

    if (!userDb) {
      let newUser = new User({
        name: googleUser.name,
        email: googleUser.email,
        img: googleUser.img,
        google: true,
        password: "-"
      });

      return newUser.save((err, createdUser) => {
        if (err) return res.status(500).json(err);

        const token = createToken();

        return res.status(201).json({
          user: createdUser,
          token
        });
      });
    }

    if (!userDb.google) {
      return res.status(400).json({
        err: {
          message: "Please sign in without you Google account"
        }
      });
    }

    const token = createToken();

    return res.status(200).json({
      user: userDb,
      token
    });
  });
});

module.exports = app;
