import React, { useEffect, useState, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import "./chat.css";
import axios from "axios";
import amongUsIcon from "./among-us.ico";
import EmojiPicker from "emoji-picker-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
const renderimage = (message, username) => {
  return (
    <div>
      <a href={message.message} target="_blank">
        <img
          src={message.message}
          className={`imagebox ${
            message.author == username ? "imagebyuser" : "imagebyreciever"
          }`}
        />
      </a>
      {message.author == username ? (
        <div className="details">
          <p> You {message.time}</p>
        </div>
      ) : (
        <div className="details" id="recieverdetail">
          <p>
            {" "}
            {message.author} {message.time}
          </p>
        </div>
      )}
    </div>
  );
};
const rendervideo = (message, username) => {
  return (
    <div>
      <a href={message.message} target="_blank">
        <video
          autoPlay
          muted
          src={message.message}
          className={`imagebox ${
            message.author == username ? "imagebyuser" : "imagebyreciever"
          }`}
        />
      </a>
      {message.author == username ? (
        <div className="details">
          <p> You {message.time}</p>
        </div>
      ) : (
        <div className="details" id="recieverdetail">
          <p>
            {" "}
            {message.author} {message.time}
          </p>
        </div>
      )}
    </div>
  );
};
const rendermessage = (message, username) => {
  if (message.author == username)
    return (
      <div className="bothmessages">
        <div className="messagebyuser">
          <h5 className="chatbyuserheading" style={{ color: "#263238" }}>
            {message.message}
          </h5>
        </div>

        <div className="details">
          <p> You {message.time}</p>
        </div>
      </div>
    );
  else
    return (
      <div className="bothmessages2">
        <div className="messagebyreciever">
          <h5 className="chatbyrecieverheading">{message.message}</h5>
        </div>
        <div className="details" id="recieverdetail">
          <p>
            {message.author} {message.time}
          </p>
        </div>
      </div>
    );
};
export const Chat = ({ socket, username, room }) => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [online, setOnline] = useState([]);
  const [hovered, setHovered] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [hovered2, setHovered2] = useState(false);
  const [animate2, setAnimate2] = useState(false);
  const [dataname, setDataName] = useState([]);
  const [img, setimg] = useState([]);
  const [data, setData] = useState([]);
  const [emoji, setEmoji] = useState(false);
  const [animationParent] = useAutoAnimate();
  console.log(dataname);
  const scrollParent = useRef();
  const scrollToBottom = () => {
    if (!scrollParent.current) return;
    setTimeout(() => {
      scrollParent.current.scrollTop = scrollParent.current.scrollHeight;
    }, 100);
  };
  useEffect(() => {
    scrollParent.current && autoAnimate(scrollParent.current);
  }, [scrollParent]);
  const renderdata = (data) => {
    return data.map((e) => {
      return (
        <p
          style={{
            marginTop: "10vh",
            color: "white",
            textAlign: "center",
            wordBreak: "break-word",
          }}
        >
          {e}
        </p>
      );
    });
  };
  const handleEmoji = () => {
    setEmoji(!emoji);
  };
  const uploadimage = (data) => {
    const formData = new FormData();
    formData.append("file", data);
    formData.append("upload_preset", import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET);


    axios
      .post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUDINARY_URL_PART}/image/upload`, formData)
      .then((Response) => {
        console.log(Response);
        const messageData = {
          type: "image",
          room: room,
          author: username,
          message: Response.data.secure_url,
          time:
            (new Date(Date.now()).getHours() % 12 || 12) +
            ":" +
            (new Date(Date.now()).getMinutes() > 9
              ? new Date(Date.now()).getMinutes()
              : "0" + new Date(Date.now()).getMinutes()) +
            (new Date(Date.now()).getHours() > 12 ? " PM" : " AM"),
        };
        console.log(messageData);
        socket.emit("send_message", messageData);
        setMessageList((list) => [...list, messageData]);
        scrollToBottom();
      });
  };
  const uploadvideo = (data) => {
    const formData = new FormData();
    formData.append("file", data);
    formData.append("upload_preset", import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET);

    axios
      .post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUDINARY_URL_PART}/video/upload`, formData)
      .then((Response) => {
        console.log(Response);
        const messageData = {
          type: "video",
          room: room,
          author: username,
          message: Response.data.secure_url,
          time:
            (new Date(Date.now()).getHours() % 12 || 12) +
            ":" +
            (new Date(Date.now()).getMinutes() > 9
              ? new Date(Date.now()).getMinutes()
              : "0" + new Date(Date.now()).getMinutes()) +
            (new Date(Date.now()).getHours() > 12 ? " PM" : " AM"),
        };
        console.log(messageData);
        socket.emit("send_message", messageData);
        setMessageList((list) => [...list, messageData]);
        scrollToBottom();
      });
  };
  // room, author, message, time, type
  const sendMessage = async () => {
    if (message !== "") {
      const messageData = {
        type: "message",
        room: room,
        author: username,
        message: message,
        time:
          (new Date(Date.now()).getHours() % 12 || 12) +
          ":" +
          (new Date(Date.now()).getMinutes() > 9
            ? new Date(Date.now()).getMinutes()
            : "0" + new Date(Date.now()).getMinutes()) +
          (new Date(Date.now()).getHours() > 12 ? " PM" : " AM"),
      };

      setMessage("");
      new Date();
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      scrollToBottom();
    }
  };

  useEffect(() => {
    if (hovered) setAnimate(true);
  }, [hovered]);
  useEffect(() => {
    if (hovered2) setAnimate2(true);
  }, [hovered2]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
      scrollToBottom();
    });
    socket.on("online", (data1) => {
      console.log(data1);
      setOnline(data1);
    });
    socket.on("disconnectedUser", (disconnectedUserID) => {
      setOnline((oldata) => {
        const newArray = [];
        oldata.forEach((user) => {
          if (user.socketID !== disconnectedUserID) {
            newArray.push(user);
          }
        });
        return newArray;
      });
    });
  }, [socket]);

  return (
    <>
      <div>
        <video
          className="chatvideo"
          src="./amongus.webm"
          autoPlay
          loop
          muted
          onClick={() => {
            setHovered(false);
            setHovered2(false);
          }}
        />

        <button
          className="onlinebtn"
          onClick={() => {
            setHovered(!hovered);
          }}
        >
          <img className="dropdownimg" src="./green2.svg" alt="" />
        </button>
      </div>
      <div className="onlines">
        <p id="onlinetag">Online</p>

        <p>
          {online.map((user) => (
            <div>
              <div className="onlineindi">
                <img className="onlineicon" src={amongUsIcon} alt="" />
                <p id="usersonline">{user.username}</p>
              </div>
            </div>
          ))}
        </p>
      </div>
      <div>
        <div>
          <div
            className={`online-mob ${
              hovered
                ? "forwardsSidebar"
                : animate
                ? "backwardsSidebar"
                : "defaultSidebar"
            }`}
          >
            <p id="onlinetag">Online</p>

            <p>
              {online.map((user) => (
                <div className="userhandler">
                  <div className="onlineindi">
                    <img className="onlineicon" src={amongUsIcon} alt="" />
                    <p id="usersonline">{user.username}</p>
                  </div>
                </div>
              ))}
            </p>
          </div>
        </div>
      </div>
      <button
        className="onlinebtn2"
        onClick={() => {
          setHovered2(!hovered2);
        }}
      >
        <img className="dropdownimg" src="./among-us-watch.svg" alt="" />
      </button>
      <div className="onlines">
        <p id="onlinetag">Media</p>
        <p>{renderdata(dataname)}</p>
      </div>
      <div>
        <div>
          <div
            className={`online-mob2 ${
              hovered2
                ? "forwardsSidebar2"
                : animate2
                ? "backwardsSidebar2"
                : "defaultSidebar2"
            }`}
          >
            <p id="onlinetag">Media</p>
            <p>{renderdata(dataname)}</p>
          </div>
        </div>
      </div>

      <div
        className="chatparent"
        onClick={() => {
          setHovered(false);
          setHovered2(false);
        }}
      >
        <img src="" alt="" srcset="" />
        <div className="chatbody">
          <div className="chatbox" ref={scrollParent}>
            {messageList.map((messageContent) => {
              return (
                <>
                  {messageContent.type == "message"
                    ? rendermessage(messageContent, username)
                    : messageContent.type == "image"
                    ? renderimage(messageContent, username)
                    : rendervideo(messageContent, username)}
                </>
              );
            })}
          </div>
        </div>
        <form
          onSubmit={() => {
            for (let i = 0; i < data.length; i++) {
              // uploadimage(data[i]);
              if (data[i] != null) {
                if (
                  data[i].name.split(".").pop() === "png" ||
                  data[i].name.split(".").pop() === "jpeg" ||
                  data[i].name.split(".").pop() === "jpg" ||
                  data[i].name.split(".").pop() === "gif" 

                )
                  uploadimage(data[i]);
                else uploadvideo(data[i]);
              }
            }

            setData([]);
            setDataName([]);
            sendMessage();
          }}
         className="chatinput">
          <div className="filesend">
            <textarea
              type="text"
              value={message}
              placeholder="enter message"
              onChange={(event) => {
                setMessage(event.target.value);
              }}
            />

            <div className="filehead">
              <label class="custom-file-upload">
                <input
                  type="file"
                  onChange={(e) => {
                    setData((list) => [...list, e.target.files[0]]);
                    if (e.target.files[0] != null)
                      setDataName((list) => [...list, e.target.files[0].name]);
                  }}
                />
                <img className="file" src="./clip.svg" alt="" />
              </label>
              <div className="emojihead" ref={animationParent}>
                <button
                  onClick={handleEmoji}
                  style={{ border: 0, background: "transparent" }}
                >
                  <img src="./smiley.svg" alt="" className="file" id="emoji" />
                </button>
                {emoji && (
                  <EmojiPicker
                    onEmojiClick={(e) => {
                      const messageData = {
                        type: "message",
                        room: room,
                        author: username,
                        message: e.emoji,
                        time:
                          (new Date(Date.now()).getHours() % 12 || 12) +
                          ":" +
                          (new Date(Date.now()).getMinutes() > 9
                            ? new Date(Date.now()).getMinutes()
                            : "0" + new Date(Date.now()).getMinutes()) +
                          (new Date(Date.now()).getHours() > 12
                            ? " PM"
                            : " AM"),
                      };
                      console.log(messageData);
                      socket.emit("send_message", messageData);
                      setMessageList((list) => [...list, messageData]);
                      scrollToBottom();
                    }}
                    theme="dark"
                    emojiStyle="apple"
                  />
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="chatbtn"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
};
