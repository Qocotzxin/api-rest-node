const express = require("express");
const fileUpload = require("express-fileupload");
const User = require("../models/user");
const Product = require("../models/product");
const fs = require("fs");
const path = require("path");
const app = express();

const allowedExtensions = ["png", "jpg", "gif", "jpeg"];
const allowedTypes = ["users", "products"];
const invalidFileError = {
  ok: false,
  err: {
    message: `Invalid extension or type.
    Valid extensions: ${allowedExtensions.join(", ")}
    Valid types: ${allowedTypes.join(", ")}`
  }
};
const termNotFound = type => ({
  ok: false,
  err: { message: `${type} not found` }
});

const getExtension = filename => {
  const filenameArray = filename.split(".");
  return filenameArray[filenameArray.length - 1];
};

const fileIsNotValid = (attachment, type) => {
  return (
    allowedExtensions.indexOf(getExtension(attachment.name)) < 0 ||
    allowedTypes.indexOf(type) < 0
  );
};

const unlinkImage = (imageName, type) => {
  const imagePath = path.resolve(
    __dirname,
    `../../uploads/${type}/${imageName}`
  );

  if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
};

const userImage = (id, res, filename) => {
  User.findById(id, (err, user) => {
    if (err) {
      unlinkImage(filename, allowedTypes[0]);
      return res.status(500).json(err);
    }
    if (!user) {
      unlinkImage(filename, allowedTypes[0]);
      return res.status(404).json(termNotFound(allowedTypes[0]));
    }

    unlinkImage(user.img, allowedTypes[0]);
    user.img = filename;

    user.save((err, updatedUser) => {
      if (err) return res.status(500).json(err);
      res.status(200).json(updatedUser);
    });
  });
};

const productImage = (id, res, filename) => {
  Product.findById(id, (err, product) => {
    if (err) {
      unlinkImage(filename, allowedTypes[1]);
      return res.status(500).json(err);
    }
    if (!product) {
      unlinkImage(filename, allowedTypes[1]);
      return res.status(404).json(termNotFound(allowedTypes[1]));
    }

    unlinkImage(product.img, allowedTypes[1]);
    product.img = filename;

    product.save((err, updatedProduct) => {
      if (err) return res.status(500).json(err);
      res.status(200).json(updatedProduct);
    });
  });
};

app.use(fileUpload());

app.put("/upload/:type/:id", (req, res) => {
  const type = req.params.type;
  const id = req.params.id;

  if (!req.files)
    return res.status(400).json({ err: { message: "No file selected" } });

  const attachment = req.files.attachment;

  if (fileIsNotValid(attachment, type))
    return res.status(400).json(invalidFileError);

  const fileName = `${id}-${new Date().getMilliseconds()}.${getExtension(
    attachment.name
  )}`;

  attachment.mv(`uploads/${type}/${fileName}`, err => {
    if (err) return res.status(500).json(err);

    type === allowedTypes[0]
      ? userImage(id, res, fileName)
      : productImage(id, res, fileName);
  });
});

module.exports = app;
