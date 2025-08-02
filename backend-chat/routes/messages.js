const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// Send a new message
router.post("/", async (req, res) => {
  const { conversationId, sender, text, imageUrl } = req.body;

  try {
    const message = new Message({
      conversationId,
      sender,
      text,
      imageUrl
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: "Failed to send message." });
  }
});


// GET unread message count for user
router.get("/unread/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    const messages = await Message.aggregate([
      {
        $match: {
          sender: { $ne: uid },
          seenBy: { $ne: uid }
        }
      },
      {
        $group: {
          _id: "$conversationId",
          count: { $sum: 1 }
        }
      }
    ]);

    const unreadMap = {};
    messages.forEach((m) => {
      unreadMap[m._id] = m.count;
    });

    res.status(200).json(unreadMap);
  } catch (err) {
    res.status(500).json({ error: "Failed to get unread count." });
  }
});

// Get all messages for a conversation (paginated)
router.get("/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  const { limit = 50, skip = 0 } = req.query;

  try {
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));
      
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages." });
  }
});

module.exports = router;
