import React, { useEffect, useState } from "react";
import "./chat.css";
export const Chat = ({ socket, username, room }) => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [online,setOnline]=useState([]);
  // const [messageList2, setMessageList2] = useState([]);

  const sendMessage = async () => {
    if (message !== "") {
      const messageData = {
        room: room,
        author: username,
        message: message,
        time:
          ((new Date(Date.now())).getHours()%12 || 12) +
          ":" +
          ((new Date(Date.now())).getMinutes()>9?(new Date(Date.now())).getMinutes():"0"+(new Date(Date.now())).getMinutes() )
          +
          ((new Date(Date.now())).getHours()>12?" PM": " AM")
      };
      
      setMessage("");
      new Date()
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      
    }
  };
   
  // useEffect(()=>{
  //          io.on("connection",(socket)=>{
  //         const onlinedata ={
  //           online:socket.id,
            
  //         };
  //         setOnline([onlinedata]);
  //       });
          
     
  // },[socket]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
      
    });
    socket.on("online",(data1)=>{
      console.log(data1)
      setOnline(data1);
    });
    socket.on("disconnectedUser",(disconnectedUserID)=>{
      setOnline((oldata)=>{
        const newArray =[];
        oldata.forEach(user=>{
          if(user.socketID!==disconnectedUserID){
            newArray.push(user)
          }
        })
        return newArray
      })
    })
  }, [socket]);

  return (
    <>
      <div>
        <video className="chatvideo" src="./amongus.webm" autoPlay loop muted />
      </div>
        <div className="onlines">
           <p>Online</p>
            
            <p>{online.map(user=><p>{user.username}</p>)}</p>
            
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
