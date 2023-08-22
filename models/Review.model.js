const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
    {
    reviewTarget: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    review: {
        type: Number,
    },
    comment: {
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    },
    {
      // this second object adds extra properties: `createdAt` and `updatedAt`
      timestamps: true,
    }
  );
  
  const review = model("Review", reviewSchema);
  
  module.exports = review;