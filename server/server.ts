import http from "http";
import { Server } from "socket.io";
import * as mongoose from "mongoose";
import { config as dotenvconfig } from "dotenv";
dotenvconfig();

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: function (origin, fn) {
      if (origin) {
        console.log(origin);
        return fn(null, origin);
      }
      return fn({ name: "CORS", message: "Error Invalid domain" });
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});
mongoose.connect(process.env.MONGO_URL || "mongdb://locahost:27017");

server.listen(process.env.PORT || 3001, () => {
  console.log(
    `expecting frontend at: ${process.env.FRONTURL || "http://localhost:3000"}`
  );
  console.log("server started");
});
export { server, io };
