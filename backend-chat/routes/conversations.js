const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");

// Create or get existing 1-on-1 conversation
router.post("/", async (req, res) => {
  const { user1, user2 } = req.body;

  try {
    // Check if conversation exists
    let conversation = await Conversation.findOne({
      members: { $all: [user1, user2] }
    });

    if (!conversation) {
      conversation = new Conversation({ members: [user1, user2] });
      await conversation.save();
    }

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ error: "Failed to create/get conversation." });
  }
});

// Get all conversations for a user
router.get("/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    const conversations = await Conversation.find({ members: uid }).sort({ "lastMessage.createdAt": -1 });
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch conversations." });
  }
});

module.exports = router;
