const express = require("express");
const fs = require("fs");
const path = require("path");
const { tokenImageToken } = require("../middlewares/authentication");
const app = express();
const notFoundImage = path.resolve(__dirname, "../assets/not-found.png");

app.get("/image/:type/:img", tokenImageToken, (req, res) => {
  const type = req.params.type;
  const img = req.params.img;
  const pathImage = path.resolve(__dirname, `../../uploads/${type}/${img}`);

  res.sendFile(fs.existsSync(pathImage) ? pathImage : notFoundImage);
});

module.exports = app;
