const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: [true, "Name is mandatory"] },
  price: { type: Number, required: [true, "Price is mandatory"] },
  description: { type: String, required: false },
  available: { type: Boolean, required: true, default: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Product", productSchema);
