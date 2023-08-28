const app = require("./app");
const { Server } = require('socket.io')

const io = new Server({
  cors: {
    origin: "http://localhost:3000"
  }
})

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join_room", (data) => {
    socket.join(data)
    console.log("User with ID", socket.id, "joined room", data)
  });

  socket.on("send_message", (data) => {
    console.log(data)
    socket.to(data.room).emit("recieve_message", data)
  })

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });

});

io.listen(5006);

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
