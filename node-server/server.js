const app = require("express")();

const express = require("express");

const http = require("http").Server(app);
///const io = require("socket.io")(http);

const io = require("socket.io")(http, {
  cors: {
    origins: ["http://localhost:3001", "http://localhost:4200", "http://localhost:8080"],
  },
});

const DataBase = require("./database.js");

const db = new DataBase();

let connectedCount = 0;

app.use("/static", express.static("./static/")); // bu yapılmazsa .js dosyalarını server görmüyor...

app.get("/", (req, res) => {
  // res.sendFile(__dirname + "/index.html");
  // res.sendFile(__dirname + "/static/index.html");
});

io.on("connection", async function (socket) {

  console.log("A user with ID: " + socket.id + " connected");
 

  socket.on("disconnect", async function () {
    console.log("A user with ID: " + socket.id + " disconnected");
   
    if(connectedCount>0)  connectedCount--;

    let data = {
      user_id: socket.id,
      online: false,
    };
    let user = await db.addUser(data);
    socket.broadcast.emit("disconnect-user", data);
    socket.broadcast.emit("connections", connectedCount);


  });

  // More Socket listening here.
  // if (io.sockets.connected){
  //socket.emit("connections", Object.keys(io.sockets.connected).length);
  socket.broadcast.emit("connections", connectedCount);
  //socket.broadcast.emit("connections", Object.keys(io.sockets.connected).length); //çalışmadı

  // }
  // else socket.emit("connections", 0);

  // const users = await db.listUsers();
  // console.log("users : ", users);

  // socket.emit("list users", users);


  //client emit message
  socket.on("chat-message", async (message) => {
    const data = {
      message: message.message,
      user_id: socket.id,
      name: message.user,
    };

    await db.storeUserMessage(data);
    socket.broadcast.emit("chat-message", message);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });

  socket.on("stopTyping", () => {
    socket.broadcast.emit("stopTyping");
  });

  socket.on("users", async () => {
    const users = await db.listUsers();
    console.log("users : ", users);

    socket.broadcast.emit("list users", users);
    socket.emit("list users", users);

  });

  // user join and  register
  socket.on("register", async (regData) => {
    const data = {
      name: regData.username,
      password: regData.password,
      user_id: socket.id,
      online: true,
    };
    //console.log(data);
    const user = await db.addUser(data);
    console.log(user);
    if (user){
       socket.emit("register", data);
      //  socket.broadcast.emit("connections", connectedCount);
    }
  });

  socket.on("joined", async (userData) => {
    let messageData = null;
    connectedCount++;
    const data = {
      name: userData.username,
      password: userData.password,
      user_id: socket.id,
      online: true,
      connectCount:connectedCount,
      // messages:{},
    };

    //console.log("joined data:", data);
    const user = await db.addUser(data);
    //console.log("joined User:", user);

    if (user) {
       messageData = await db.fetchUserMessages(data);
      data.messages = messageData;
     // console.log("joined emit :", data);
      socket.emit("connections", connectedCount);
      socket.emit("joined", data);
      socket.broadcast.emit("connections", connectedCount);
      
    }
  });
  //
  socket.on("leave", (data) => {
    // Delete user data here
    socket.broadcast.emit("leave", data);
  });

  /// ***** ****

  socket.on("my message", (data) => {
    console.log("con :my message :", data);

    socket.emit("my-broadcast", data);
  });
}); //io.on

var port = process.env.PORT || 3000;

http.listen(port, () => {
  console.log("Listening on port *: 3000");
});