import React, { useEffect, useState } from "react";
import "./chat.css";
import amongUsIcon from "./among-us.ico"
export const Chat = ({ socket, username, room }) => {
 
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [online, setOnline] = useState([]);
  const [hovered, setHovered] = useState(false);
  const [animate, setAnimate] = useState(false)

  // const [messageList2, setMessageList2] = useState([]);

  const sendMessage = async () => {
    if (message !== "") {
      const messageData = {
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
    }
  };

  useEffect(()=>{
    if(hovered) setAnimate(true)
  },[hovered])

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
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
        <video className="chatvideo" src="./amongus.webm" autoPlay loop muted />
        <button className="onlinebtn"    onClick={() => {
          setHovered(!hovered);
   
        }}>
          <img
            className="dropdownimg"
            src="./green2.svg"
            alt=""
          />
        </button>
      </div>
      <div className="onlines" >
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
        <div  className={`online-mob ${hovered?"forwardsSidebar": animate?"backwardsSidebar":"defaultSidebar"}`}>
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
      
      <div className="chatparent">
        <img src="" alt="" srcset="" />
        <div className="chatbody">
          <div className="chatbox">
            {messageList.map((messageContent) => {
              return (
                <>
                  {messageContent.author === username ? (
                    <div className="bothmessages">
                      <div className="messagebyuser">
                        <h5 className="chatbyuserheading">
                          {messageContent.message}
                        </h5>
                      </div>
                      <div className="details">
                        <p> You {messageContent.time}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bothmessages2">
                      <div className="messagebyreciever">
                        <h5 className="chatbyrecieverheading">
                          {messageContent.message}
                        </h5>
                      </div>
                      <div className="details" id="recieverdetail">
                        <p>
                          {messageContent.author} {messageContent.time}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              );
            })}
          </div>
        </div>
        <div className="chatinput">
          <textarea
            type="text"
            value={message}
            placeholder="enter message"
            onChange={(event) => {
              setMessage(event.target.value);
            }}
          />

          <button onClick={sendMessage} className="chatbtn">
            Send
          </button>
        </div>
      </div>
    </>
  );
};
