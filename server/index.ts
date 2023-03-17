import { io } from "./server";
import messagesModel from "./schema";

const users = new Map<
  String,
  { username: String; socketID: String; roomID: String }[]
>();

io.on("connection", (socket: any) => {
  console.log(`User connected with id ${socket.id}`);

  socket.on("join_room", (data: string) => {
    socket.join(data);
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
      // await msgschema.update({roomid: data.room},{$push: {message: data}})
      const room = await messagesModel.findOne({ roomId: data.room });
      if (!room) {
        await messagesModel.create({ roomId: data.room });
      }
      await messagesModel.updateOne(
        { roomId: data.room },
        { $push: { messages: data } }
      );

      socket.to(data.room).emit("receive_message", data);
    }
  );
  socket.on("delete", async (roomId: String) => {
    await messagesModel.deleteOne({ roomId: roomId });
  });

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
