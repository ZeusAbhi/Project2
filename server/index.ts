import http from "http";
import { Server } from "socket.io";

const server=http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); /* @dev First, read about security */
res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
});
const users = new Map<String, {username: String, socketID: String, roomID: String}[]>();

const io = new Server(server, {
    cors: {
      origin: `${process.env.FRONTURL || "http://localhost:3000"}`,
    },
  });

  io.on("connection",(socket: any)=>{
    console.log(`User connected with id ${socket.id}`);

    socket.on("join_room", (data: string) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
      });
      socket.on("send_message",(data: {
        room: string,
        message: string,
        author: string,
        time: any
      })=>{
          
        socket.to(data.room).emit("receive_message",data);
      });

      socket.on("online_users",(data: string,dataroom: string)=>{
        
        console.log("prev",users  )
        console.log(dataroom,users.has(dataroom))
        if(users.has(dataroom)){
          const t = (users.get(dataroom))||[];
          users.set(dataroom,[...t,{username:data,socketID: socket.id,roomID: dataroom}])
        }else{
          users.set(dataroom,[{username:data,socketID: socket.id, roomID: dataroom}])
        }
          io.emit("online",users.get(dataroom));
          console.log(users)
      });

    socket.on("disconnect",()=>{
        users.forEach(roomArray=>{
          roomArray.forEach(user=>{
            if(user.socketID == socket.id){
              users.set(user.roomID,(users.get(user.roomID)||[]).filter(user=>user.socketID!=socket.id))
            }
          })
        })
        io.emit("disconnectedUser",socket.id)
        console.log(`User disconnected with id ${socket.id}`);
        console.log(users)
    });
  });
  
server.listen(process.env.PORT || 3001,()=>{
    console.log(`expecting frontend at: ${process.env.FRONTURL || "http://localhost:3000"}`)
    console.log("server started");
})
