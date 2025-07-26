const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
  sender: String, 
  text: String,
  imageUrl: String,
  isDeleted: { type: Boolean, default: false },
  deletedBy: {
  type: [String],
  default: []
},
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Message", messageSchema);
