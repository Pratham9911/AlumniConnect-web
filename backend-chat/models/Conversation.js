const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    members: {type:[String] , required: true},
    lastMessage: {
        text:String,
        sender: String,
        createdAt: Date
    },

    createAt : {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Conversation" , conversationSchema);