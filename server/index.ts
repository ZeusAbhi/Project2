import { io } from "./server";
import messagesModel from "./schema";

const users = new Map<
  String,
  { username: String; socketID: String; roomID: String }[]
>();
  // Connection to socket from frontend
io.on("connection", (socket: any) => {
  console.log(`User connected with id ${socket.id}`);
  // Creating a room
  socket.on("join_room", (data: string) => {
    socket.join(data);
    // Searching if room exists or not
    messagesModel.findOne({ roomId: data }).then((data) => {
      if (!data || !data.messages) return;
      data.messages.forEach((message) => {
        socket.emit("receive_message", message);
      });
    });
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });
  socket.on(
    "send_message",
    async (data: {
      type: string;
      room: string;
      message: string;
      author: string;
      time: string;
    }) => {
      // If room doesn't exist ,make a new room else update the room
      const room = await messagesModel.findOne({ roomId: data.room });
      if (!room) {
        await messagesModel.create({ roomId: data.room });
      }
      await messagesModel.updateOne(
        { roomId: data.room },
        { $push: { messages: data } }
      );
      // sending messages to all the connected users
      socket.to(data.room).emit("receive_message", data);
    }
  ); 
  //  Function to delete the room
  socket.on("delete", async (roomId: String) => {
    await messagesModel.deleteOne({ roomId: roomId });
  });
  //  Display previous messages to the user on log out and log in
  socket.on("online_users", (data: string, dataroom: string) => {
    console.log("prev", users);
    console.log(dataroom, users.has(dataroom));
    if (users.has(dataroom)) {
      const t = users.get(dataroom) || [];
      users.set(dataroom, [
        ...t,
        { username: data, socketID: socket.id, roomID: dataroom },
      ]);
    } else {
      users.set(dataroom, [
        { username: data, socketID: socket.id, roomID: dataroom },
      ]);
    }
    io.emit("online", users.get(dataroom));
    console.log(users);
  });
  // Disconnect the user 
  socket.on("disconnect", () => {
    users.forEach((roomArray) => {
      roomArray.forEach((user) => {
        if (user.socketID == socket.id) {
          users.set(
            user.roomID,
            (users.get(user.roomID) || []).filter(
              (user) => user.socketID != socket.id
            )
          );
        }
      });
    });
    io.emit("disconnectedUser", socket.id);
    console.log(`User disconnected with id ${socket.id}`);
    console.log(users);
  });
});
