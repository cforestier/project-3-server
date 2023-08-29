const { model, Schema } = require('mongoose')

const messageSchema = new Schema({
    chatId: String,
    senderId: String,
    message: String,
},
{
    timestamps: true
})

module.exports = model("Message", messageSchema)