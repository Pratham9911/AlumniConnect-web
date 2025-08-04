const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");

// Create or get existing 1-on-1 conversation
router.post("/", async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
      $expr: { $eq: [{ $size: "$members" }, 2] }, // Ensure it's strictly 1-to-1
    });

    if (!conversation) {
      conversation = new Conversation({ members: [senderId, receiverId] });
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
  console.log("✅ Received GET request for UID:", uid);

  try {
    if (!uid) {
      console.error("❌ UID is missing");
      return res.status(400).json({ error: "UID is required" });
    }

    const conversations = await Conversation.find({
      members: uid, // check if members contains uid
    });

    console.log("✅ Conversations fetched:", conversations.length);
    res.status(200).json(conversations);
  } catch (err) {
    console.error("❌ Error fetching conversations:", err); // this is what we need
    res.status(500).json({ error: "Failed to fetch conversations." });
  }
});


module.exports = router;
