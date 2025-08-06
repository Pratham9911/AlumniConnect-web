
//This file handles user 1-1 real-time chats

const Message = require("../models/Message");

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User joins a conversation room
    socket.on("join-conversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined conversation: ${conversationId}`);
    });

   //this is for Mark as read
   socket.on('mark-messages-seen',async({conversationId,userId}) => {
      console.log(`➡️ Marking messages as seen by ${userId} in ${conversationId}`);
   
    try{
        await Message.updateMany(
          {
            conversationId,
          seenBy: { $ne: userId},
        sender: {$ne: userId}   
             },
             {
               $addToSet: { seenBy: userId}
             }
        )
  console.log(`✅ ${result.modifiedCount} messages updated`);
        io.to(conversationId).emit('messages-seen', { conversationId, seenBy:userId });
      }
      catch(err){
         console.error
      }
   });


    // Send a new message
    socket.on("send-message", async (data) => {
      const { conversationId, sender, text, imageUrl } = data;

      const message = new Message({
        conversationId,
        sender,
        text,
        imageUrl
      });

      await message.save();

      // Send the message to others in the same room
      io.to(conversationId).emit("receive-message", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

module.exports = socketHandler;
