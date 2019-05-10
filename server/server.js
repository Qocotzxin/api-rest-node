require('./config/config');
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const error_400 = {
    ok: false,
    message: 'Missing a parameter'
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/users", (req, res) => {
  res.json("getUsers");
});

app.post("/users", (req, res) => {
  const body = req.body;

  !body.name ? res.status(400).json(error_400) : res.json({ body });
});

app.put("/users/:id", (req, res) => {
  const id = req.params.id;

  res.json({
    id
  });
});

app.delete("/users", (req, res) => {
  res.json("deleteUser");
});

app.listen(process.env.PORT, () => {
  console.log("Listening port 3000");
});
