import React, { useState } from "react";
import "./frontpage.css";
import io from "socket.io-client";
import { Chat } from "./chat";
const socket = io.connect(import.meta.env.VITE_URL);

export const Frontpage = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [chat, setChat] = useState(true);
  // const [online,setOnline]=useState([]);

  const joinroom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setChat(false);
      //  setOnline((list) => [...list, username])
      socket.emit("online_users", username,room);
       
    }
  };
  return (
    <>
      {chat ? (
        <div className="parent">
          <div>
            <video
              className="frontvideo"
              src="./amongusfront.mp4"
              autoPlay
              loop
              muted
            />
          </div>
          <div className="front">
            <h1 className="chat">Chat</h1>
            <div className="join">
              <input
                type="text"
                placeholder="name"
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
              <input
                type="text"
                placeholder="room id"
                onChange={(event) => {
                  setRoom(event.target.value);
                }}
              />
              <button onClick={joinroom} className="btn">
                join
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </>
  );
};
