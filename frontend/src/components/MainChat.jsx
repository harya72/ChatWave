import React, { useState, useEffect, useRef } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import { useAuth } from "../context/AuthContext";
import "../index.css";

const MainChat = ({ user }) => {
  const [message, setMessage] = useState("");
  const { socket, messageList, setMessageList, typingIndicator, whoIsTyping } =
    useWebSocket();
  const { userData } = useAuth();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const container = chatContainerRef.current;
    container.scrollTop = container.scrollHeight;
  }, [messageList]);
  const SendMsgComponent = ({ message, time }) => {
    const formatedTimeString = new Date(time);
    const formattedTime = formatedTimeString.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return (
      <div>
        <div className="flex-row-reverse flex max-w-full">
          <div className="flex-row-reverse flex">
            <span className="font-inter text-xs self-center text-[#A19791]">
              {formattedTime}
            </span>
            {/* <span className="font-inter font-semibold m-1 mx-2">You</span> */}
          </div>

          <div className="max-w-[50%] min-w-40 flex flex-wrap min-h-10 items-center px-2 text-white font-inter m-2 text-sm bg-[#FF731D] rounded-md">
            {message}
          </div>
        </div>
      </div>
    );
  };

  const ReceivingMsg = ({ message, time }) => {
    const formatedTimeString = new Date(time);
    const formattedTime = formatedTimeString.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return (
      <div>
        <div>
          <div className=" max-w-[40%] inline-block min-h-10 px-2 font-inter m-2 text-sm bg-[#F7F5F4] rounded-md">
            <div className="flex justify-between">
              <div className="flex-wrap items-center py-2 mr-2">{message}</div>
              <div className="flex justify-between items-end">
                <span className="font-inter text-xs text-[#A19791] self-center">
                  {formattedTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          source: "get_messages",
          receiver: user.username,
          sender: userData.user,
        })
      );
    }
    const handleMessageList = (event) => {
      const data = JSON.parse(event.data);
      if (data.source === "get_messages") {
        if (data.data[1] === user.username) {
          setMessageList(data.data);
        }
      }
    };

    if (socket) {
      socket.addEventListener("message", handleMessageList);
    }
  }, [user]);

  useEffect(() => {
    console.log(whoIsTyping);
    if (message != "") {
      socket.send(
        JSON.stringify({
          source: "message_typing",
          username: user.username,
        })
      );
    }
  }, [message]);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN && message != "") {
      socket.send(
        JSON.stringify({
          source: "realtime",
          message: message,
          receiver: user.username,
          sender: userData.user,
        })
      );
      // Update message list with the new message
      setMessageList((prevMessages) => [
        ...prevMessages,
        {
          message: message,
          sent_by: userData.user,
          timestamp: new Date().toISOString(),
        },
      ]);
      setMessage("");

      return socket;
    } else {
      console.error("WebSocket connection not open.");
      return null;
    }
  };

  // Function to handle message_seen
  const handleNewMessage = (sender) => {
    if (user.username === sender) {
      socket.send(
        JSON.stringify({
          source: "message_seen",
          sender: sender,
        })
      );
    }
  };

  useEffect(() => {
    if (userData && socket && socket.readyState === WebSocket.OPEN) {
      handleNewMessage(user.username);
    }
  }, [messageList, user]);
  return (
    <div className="  flex-1 flex-col h-screen dsff  flex   ">
      <div className="p-2 flex  h-24 shadow-md ">
        <div className="m-2  flex justify-center w-20 h-20 items-center ">
          <img className="absolute" src="./assets/ellipse_active.png" alt="" />
          {user.thumbnail_url ? (
            <img
              src={`http://127.0.0.1:8000${user.thumbnail_url}`}
              className="rounded-full"
              alt="person_profile"
            />
          ) : (
            <img
              src={`http://127.0.0.1:8000/media/avatars/blank.png`}
              className="rounded-full"
              alt="person_profile"
            />
          )}
        </div>
        <div className=" flex-col p-5">
          <span className="font-bold text-xl truncate font-inter">
            {user.username}
          </span>
          <div className="font-light text-sm truncate font-inter text-gray-600">
            {typingIndicator && whoIsTyping===user.username?'is typing...':<></>}
          </div>
        </div>
        {/* <div className=" flex flex-1 justify-end items-center gap-5">
          <div className="w-[50px] h-[50px] rounded-full flex justify-center items-center bg-gray-400">
            <img src="./assets/video_call.png" alt="video_call" />
          </div>
          <div className="w-[50px] h-[50px] rounded-full flex justify-center items-center bg-gray-400">
            <img src="./assets/phone.png" alt="phone" />
          </div>
        </div> */}
      </div>

      <div
        className="overflow-y-scroll no-scrollbar h-full scroll-bottom"
        ref={chatContainerRef}
      >
        <div className=" p-2 h-full flex flex-col justify-between ">
          <div id="chat-container">
            {/* <p className="font-inter text-center">Yesterday</p> */}
            {messageList ? (
              <>
                {messageList.map((item, index) => {
                  if (item.sent_by === user.username) {
                    return (
                      <ReceivingMsg
                        key={index}
                        message={item.message}
                        time={item.timestamp}
                      />
                    );
                  }
                  if (item.sent_by === userData.user) {
                    return (
                      <SendMsgComponent
                        key={index}
                        message={item.message}
                        time={item.timestamp}
                      />
                    );
                  }
                })}
              </>
            ) : (
              <></>
            )}
            <div className="flex flex-row">
              {typingIndicator && whoIsTyping===user.username ? (
                <>
                  <MessageTypingAnimation />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="px-6">
        <div className="relative mb-3 p-2">
          <div
            className="absolute inset-y-0  right-0 flex items-center gap-5 cursor-pointer"
            onClick={() => {
              sendMessage();
            }}
          >
            {/* <img src="./assets/mic.png" alt="" /> */}
            {/* <img src="./assets/pic.png" alt="" /> */}
            {/* <img src="./assets/attachment.png" alt="" /> */}
            <img src="./assets/send.png" alt="" />
          </div>
          <input
            type="text"
            id="input-group-1"
            className="bg-gray-50  border outline-neutral-400 border-gray-300 text-gray-900 max-w-[90%] w-full text-sm rounded-lg focus:ring-blue-500  block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
            placeholder="Send your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.shiftKey && e.key === "Enter") {
                setMessage(message + "\n");
              } else if (e.key === "Enter") {
                sendMessage();

                setMessage("");
                e.preventDefault();
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

const MessageTypingAnimation = () => {
  const { setTypingIndicator } = useWebSocket();

  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      const typingTimeout = setTimeout(() => {
        setTypingIndicator(false);
      }, 4000); // Adjust the duration of typing animation as needed
      return () => clearTimeout(typingTimeout);
    }); // Adjust the delay between each typing animation as needed
    return () => clearTimeout(animationTimeout);
  }, []);

  return (
    <div className="ticontainer">
      <div className="tiblock">
        <div className="tidot"></div>
        <div className="tidot"></div>
        <div className="tidot"></div>
      </div>
    </div>
  );
};
export default MainChat;
