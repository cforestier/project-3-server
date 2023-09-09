const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    username: {
      type: String,
      required: [true, "Username is required."],
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    roles: {
      type: [String],
      enum: ["seller", "buyer", "admin"],
      default: "buyer",
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    image: {
      type: String,
      default: "https://img.freepik.com/free-icon/user_318-159711.jpg?w=2000",
    },
    productsLiked: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
