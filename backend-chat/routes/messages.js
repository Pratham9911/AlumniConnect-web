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
// Get all messages for a conversation (paginated)
router.get("/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  const { uid, limit = 50, skip = 0 } = req.query;   // uid must be passed from frontend

  try {

   
    const messages = await Message.find({
      conversationId,
      deletedBy: { $ne: uid }   
    })
      .sort({ createdAt: 1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));


    res.status(200).json(messages);
  } catch (err) {
    console.error("Failed to fetch messages:", err);
    res.status(500).json({ error: "Failed to fetch messages." });
  }
});



// Delete a message (for me / for everyone)
router.delete("/:messageId", async (req, res) => {
  const { messageId } = req.params;
  const { uid, otherUid } = req.query; // pass both users in query

  try {
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: "Message not found" });

    // Add current user to deletedBy if not already there
    if (!message.deletedBy.includes(uid)) {
      message.deletedBy.push(uid);
    }

    // If both users deleted, remove message permanently
    if (
      otherUid &&
      message.deletedBy.includes(uid) &&
      message.deletedBy.includes(otherUid)
    ) {
      await Message.deleteOne({ _id: messageId });
      return res.status(200).json({ success: true, deleted: "permanent" });
    }

    await message.save();
    res.status(200).json({ success: true, deleted: "for-me" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message." });
  }
});

module.exports = router;
