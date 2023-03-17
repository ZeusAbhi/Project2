import React, { useState } from "react";
import "./frontpage.css";
import io from "socket.io-client";
import { Chat } from "./chat";
import TypeIt from "typeit-react";

const socket = io.connect(import.meta.env.VITE_APP_SOCKET_URL);

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
      socket.emit("online_users", username, room);
    }
  };
  function handleKeyPress(event) {
    if (event.key === "Enter") {
      joinroom();
    }
  }
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
            <h1 className="chat">
              <h1>
                <TypeIt
                  options={{ loop: true }}
                  getBeforeInit={(instance) => {
                    instance
                      .type("Connect with your Friends")
                      .pause(750)
                      .delete(25)
                      .type("Send Emojis 😀")
                      .pause(750)
                      .delete(14)
                      .type("Multiple Rooms Support")
                      .pause(750)
                      .delete(25)
                      .type("Share Multiple Images and Videos");

                    // Remember to return it!
                    return instance;
                  }}
                />
              </h1>
            </h1>
            <form
                onSubmit={(e)=>{
                  e.preventDefault();
                  joinroom();
                }}
                className="join">
              <input
                type="text"
                placeholder="name"
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
              <input
                type="text"
                value={room}
                placeholder="room id"
                onChange={(event) => {
                  setRoom(event.target.value);
                }}
              />
              <button
                type="submit"
                tabIndex="0"
                onKeyDown={handleKeyPress}
                onClick={joinroom}
                className="btn"
              >
                join
              </button>
              <button
                onClick={() => {
                  socket.emit("delete", room);
                  setRoom("");
                }}
                className="btn"
                id="del"
              >
                Delete Room
              </button>
            </form>
          </div>
          <footer>
            <div className="foot">
              <a href="https://github.com/ZeusAbhi">
                <img className="footimg" src="./github2.svg" alt="" srcset="" />
              </a>

              <a href="https://www.linkedin.com/in/abhinav-tushar-36149521b/">
                <img
                  className="footimg"
                  src="./linkedin2.svg"
                  alt=""
                  srcset=""
                />
              </a>
              <a href="https://www.facebook.com/abhinav.tushar.3">
                <img
                  className="footimg"
                  src="./facebook.svg"
                  alt=""
                  srcset=""
                />
              </a>
            </div>
          </footer>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </>
  );
};
