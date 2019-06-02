const express = require("express");
const { adminVerify, tokenVerify } = require("../middlewares/authentication");
const app = express();
const Category = require("../models/category");
const elementNotFound = id => {
  return {
    err: {
      message: `No elements found with id: ${id}`
    }
  };
};

// GET todas las categorias con paginado
app.get("/category", tokenVerify, (req, res) => {
  const skip = +req.query.skip || 0;
  const limit = +req.query.limit || 10;

  Category.find({})
    .skip(skip)
    .limit(limit)
    .exec((err, categories) => {
      if (err) return res.status(400).json(err);

      res.status(200).json({ categories });
    });
});

// GET categoria por id
app.get("/category/:id", tokenVerify, (req, res) => {
  const id = req.params.id;

  Category.findById(id, (err, category) => {
    if (err) return res.status(401).json(elementNotFound(id));

    res.status(200).json({ category });
  });
});

// POST crear categoria
app.post("/category", [tokenVerify, adminVerify], (req, res) => {
  const { description } = req.body;

  Category.create({ description })
    .then(category => res.status(201).json({ category }))
    .catch(err => res.status(400).json(err));
});

// PUT actualizar categoria
app.put("/category/:id", [tokenVerify, adminVerify], (req, res) => {
  const id = req.params.id;
  const { description } = req.body;

  Category.findByIdAndUpdate(
    id,
    { description },
    { new: true },
    (err, category) => {
      if (err) return res.status(404).json(elementNotFound(id));

      res.status(200).json({ category });
    }
  );
});

// DELETE telimina fisica de categoria (solo admin)
app.delete("/category/:id", [tokenVerify, adminVerify], (req, res) => {
  const id = req.params.id;

  Category.findByIdAndDelete(id, (err, category) => {
    if (err) return res.status(401).json(elementNotFound(id));

    return res.status(200).json(category);
  });
});

module.exports = app;
