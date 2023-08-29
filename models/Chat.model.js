const { model, Schema } = require("mongoose");

const chatSchema = new Schema(
  {
    members: Array,
  },
  {
    timestamps: true,
  }
);

module.exports = model("Chat", chatSchema)