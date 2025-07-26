const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');


const conversationRoutes = require('./routes/conversations')
const messageRoutes = require('./routes/messages')

const socketHandler = require("./sockets/chat");
socketHandler(io);


dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server , {
    cors: {
        origin: '*',
        methods: ['GET','POST']
    }
});

app.use(cors());
app.use(express.json());

app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/',(res,req) => {
    res.send("Alumni chat API is running...");
})



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

io.on('connection',(socket) => {
    console.log('New client connected:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
    
})