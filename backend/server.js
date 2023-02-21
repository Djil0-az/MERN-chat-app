//import packages
const express = require('express');
const app = express()
app.use(express.json());

//environment variables
const dotenv = require('dotenv');

dotenv.config();
const port = process.env.PORT || 5000;

//DB
const connectDB = require('./config/database/db');
connectDB();
//routers 
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const {notFound, errorHandler} = require ('./middleware/errorMiddleware');
const Chat = require('./Models/chatModel');



// API endpoints
app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);
// Error handlers
app.use(notFound);
app.use(errorHandler);

// start server 
const server = app.listen(port,console.log(`Sever running on port ${port}`));


//  web sockets 
const io = require('socket.io')(server,{
    pingTimeout: 50000,
    cors: {
        origin: 'http://localhost:3000/',
    }
});
// create connection 
io.on('connection',(socket)=>{
     console.log("socket.io connected");
    // set up and take user data from front end create room using user data
    socket.on('setup',(userData)=>{
    socket.join(userData._id);
    socket.emit('connected');
    });
    // Chat room 
    socket.on("join chat", (room)=>{
        socket.join(room);
        console.log("user joined room: "+ room);
        });
        // user is typing 
        socket.on('typing',(room)=>socket.in(room).emit('typing'));
        socket.on('stop typing',(room)=>socket.in(room).emit('stop typing'));

    // manage chat messages and send to chatroom in real time 
    socket.on('new message',(newMessageRecieved)=>{
         var chat = newMessageRecieved.chat;
        //  console.log(newMessageRecieved);
        //  console.log(chat.users);

        // if nothing then just return a simple message in the console 
        if (!chat.users){
            return console.log("chat.users undefined!");
        }
        // send message to all other users 
        chat.users.forEach((user)=>{
            // except sender
            if(user._id == newMessageRecieved.sender._id) return;
            // send message to other users
           socket.in(user._id).emit("message recieved",newMessageRecieved);
        });
    });
    
    // close socket
    socket.off("setup",()=>{
        console.log("user disconnected...");
        socket.leave(userData._id);
    }); 

});

