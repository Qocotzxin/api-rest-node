const express = require("express");
const { tokenVerify } = require("../middlewares/authentication");
const app = express();
const Product = require("../models/product");
const elementNotFound = id => {
  return {
    err: {
      message: `No elements found with id: ${id}`
    }
  };
};

app.get("/product", tokenVerify, (req, res) => {
  const skip = +req.query.skip || 0;
  const limit = +req.query.limit || 10;

  Product.find({ available: true })
    .skip(skip)
    .limit(limit)
    .sort("name")
    .populate("user", "name email")
    .populate("category", "description")
    .exec((err, products) => {
      if (err) return res.status(400).json(err);

      Product.estimatedDocumentCount((err, length) => {
        if (err) return res.status(500).json(err);

        res.status(200).json({ products, length });
      });
    });
});

app.get("/product/:id", tokenVerify, (req, res) => {
  const id = req.params.id;

  Product.findById(id, (err, product) => {
    if (err) return res.status(401).json(elementNotFound(id));

    res.status(200).json({ product });
  });
});

app.get("/product/search/:term", tokenVerify, (req, res) => {
  const term = req.params.term;
  const regex = new RegExp(term, 'i');

  Product.find({ name: regex })
    .populate("category", "description")
    .exec((err, products) => {
      if (err) return res.status(401).json(err);

      res.status(200).json({ products });
    });
});

app.post("/product", tokenVerify, (req, res) => {
  const { name, price, description, category, available } = req.body;
  const user = req.user._id;

  Product.create({ name, price, description, category, available, user })
    .then(product => res.status(201).json({ product }))
    .catch(err => res.status(500).json(err));
});

app.put("/product/:id", tokenVerify, (req, res) => {
  const id = req.params.id;
  const { name, price, description, category, available } = req.body;

  Product.findByIdAndUpdate(
    id,
    { name, price, description, category, available },
    { new: true, useFindAndModify: false, runValidators: true },
    (err, product) => {
      if (!product) return res.status(500).json(err);
      if (err) return res.status(404).json(elementNotFound(id));

      res.status(200).json({ product });
    }
  );
});

app.delete("/product/:id", tokenVerify, (req, res) => {
  const id = req.params.id;

  Product.findByIdAndUpdate(
    id,
    { available: false },
    { new: true, useFindAndModify: false, runValidators: true },
    (err, product) => {
      if (err) return res.status(401).json(elementNotFound(id));

      return res.status(200).json(product);
    }
  );
});

module.exports = app;
