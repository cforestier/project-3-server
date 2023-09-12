const { model, Schema } = require("mongoose");

const orderSchema = new Schema({
  products: {
    type: [{}],
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

const order = model("Order", orderSchema);

module.exports = order;
