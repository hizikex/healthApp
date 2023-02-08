require('dotenv').config()
const cors = require("cors")
const express = require("express");
const socket = require("socket.io");
const mongoose = require('mongoose')
const fileUploader = require('express-fileupload')
const Router = require('./routers/addAdmin')
// const dotenv = require("dotenv");
const app = express()

const db = process.env.DATABASE

app.use(cors())
app.use(express.json());

app.get('/', (req, res)=>{
    res.status(200).send("My Api is connected successfully")
})

app.use(fileUploader({
    useTempFiles: true
}))

app.use('/api', Router)

mongoose.set('strictQuery', true)
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("MongooseDB connected")
})

const server = app.listen(process.env.PORT || 5555, ()=>{
    console.log("Server is listening to PORT: 5555")
})

const io = socket(server, {
    cors: {
      origin: "http://localhost:5555",
      credentials: true,
    },
  });

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to)
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});