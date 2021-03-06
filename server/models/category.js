const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Category schema
 */
const categorySchema = new Schema({
  description: {
    type: String,
    unique: true,
    required: [true, "Description is mandatory"]
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User data is mandatory"]
  }
});

module.exports = mongoose.model("Category", categorySchema);
