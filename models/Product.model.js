const { model, Schema } = require("mongoose");

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  categories: {
    type: [String],
    required: true,
  },
});

const product = model("Product", productSchema)

module.exports = product