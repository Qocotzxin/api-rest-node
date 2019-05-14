require("./config/config");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./routes/index'));

mongoose.connect(
  process.env.URL_DB,
  { useNewUrlParser: true, useCreateIndex: true },
  err => {
    if (err) {
      throw err;
    } else {
      console.log("Connection created");
    }
  }
);

app.listen(process.env.PORT, () => {
  console.log("Listening port 3000");
});
