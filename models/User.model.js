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
        ref: "Review"
      }
    ],
    roles: {
      type: [ String ],
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
      default: "" //ADD SOME KIND OF DEFAULT IMAGE
    }
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
