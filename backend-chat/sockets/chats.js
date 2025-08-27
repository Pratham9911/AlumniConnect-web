
//This file handles user 1-1 real-time chats

//last modified: aug 2025 added mark as read feature
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User joins a conversation room
    socket.on("join-conversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined conversation: ${conversationId}`);
    });

    //this is for Mark as read
    socket.on('mark-messages-seen', async ({ conversationId, userId }) => {
      console.log(`➡️ Marking messages as seen by ${userId} in ${conversationId}`);

      try {
        const result = await Message.updateMany(
          {
            conversationId,
            seenBy: { $ne: userId },
            sender: { $ne: userId },
          },
          {
            $addToSet: { seenBy: userId },
          }
        );

        console.log(`✅ ${result.modifiedCount} messages updated`);

        io.to(conversationId).emit('messages-seen-update', {
          conversationId,
          seenBy: userId,
        });
      } catch (err) {
        console.error("❌ Error marking messages as seen:", err);
      }
    });



    // Send a new message
    socket.on("send-message", async (data) => {
      const { conversationId, sender, text, imageUrl } = data;

      const message = new Message({
        conversationId,
        sender,
        text,
        imageUrl,
        seenBy: [sender]
      });

      await message.save();

      // Send the message to others in the same room
      io.to(conversationId).emit("receive-message", message);
    });

    // delete message handler

    socket.on("delete-message", async ({ messageId, userId, type }) => {
      try {
        const msg = await Message.findById(messageId).lean();
        if (!msg) {
          socket.emit("error-message", { message: "Message not found" });
          return;
        }

        // DELETE FOR ME
        if (type === "me") {
          const updated = await Message.findByIdAndUpdate(
            messageId,
            { $addToSet: { deletedBy: userId } },
            { new: true }
          ).lean();

          const convo = await Conversation.findById(updated.conversationId).lean();
          const members = (convo?.members || []).map(String);

          const allDeleted =
            members.length > 0 &&
            members.every((uid) => (updated.deletedBy || []).includes(uid));

          if (allDeleted) {
            await Message.deleteOne({ _id: messageId });
            io.to(String(updated.conversationId)).emit("message-removed", {
              messageId,
            });
          } else {
            // only tell this user to hide locally
            socket.emit("message-deleted", { messageId, type: "me" });
          }
          return;
        }

        // DELETE FOR EVERYONE
        if (type === "everyone") {
          await Message.deleteOne({ _id: messageId });
          io.to(String(msg.conversationId)).emit("message-removed", { messageId });
          return;
        }

        socket.emit("error-message", { message: "Invalid delete type" });
      } catch (err) {
        console.error("❌ Delete message error:", err);
        socket.emit("error-message", { message: "Delete failed" });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

module.exports = socketHandler;
