const app = require("./app");
const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: process.env.ORIGIN || "http://localhost:3000",
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({ userId, socketId: socket.id });
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );
    const response = {
      message: message.newMessage,
      recipientId: message.recipientId,
      chatId: message.chatId,
    };

    if (user) {
      io.to(user.socketId).emit("getMessage", response);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(443);

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server listening ${PORT}`);
});
