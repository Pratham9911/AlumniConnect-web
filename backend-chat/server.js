const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const conversationRoutes = require('./routes/conversations')
const messageRoutes = require('./routes/messages')

const socketHandler = require("./sockets/chats");


const app = express();
const server = http.createServer(app);
const io = new Server(server , {
    cors: {
        origin: '*',
        methods: ['GET','POST']
    }
});

const onlineUsers = new Set();

io.on('connection', (socket) => {
  // When frontend emits 'user-online'
  socket.on('user-online', (uid) => {
    socket.uid = uid;
    onlineUsers.add(uid);
    io.emit('online-users', Array.from(onlineUsers)); // broadcast online list
  });

  // When user disconnects
  socket.on('disconnect', () => {
    if (socket.uid) {
      onlineUsers.delete(socket.uid);
      io.emit('online-users', Array.from(onlineUsers));
    }
  });
});

socketHandler(io);


app.use(cors());
app.use(express.json());

app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error("❌ MONGODB_URI is not defined in environment variables");
  process.exit(1);
}


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send("Alumni chat API is running...");
});




const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// io.on('connection',(socket) => {
//     console.log('New client connected:', socket.id);
    
//     socket.on('disconnect', () => {
//         console.log('Client disconnected:', socket.id);
//     });
    
// })