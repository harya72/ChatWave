import React, { useState, useEffect, useRef } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import { useAuth } from "../context/AuthContext";
import { createRoot } from "react-dom/client";

const MainChat = ({ user }) => {
  const [message, setMessage] = useState("");
  const { socket } = useWebSocket();
  const { userData } = useAuth();
  const [turn, setTurn] = useState(true);
  const [receivedMsg, setReceivedMsg] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const container = chatContainerRef.current;
    container.scrollTop = container.scrollHeight;
  });
  const SendMsgComponent = () => {
    return (
      <div>
        {!turn ? (
          <div className="flex justify-end">
            <div className="w-full">
              <div className="flex justify-end">
                <span className="font-inter font-semibold mt-2 m-2">You</span>
                <span className="font-inter text-xs self-center text-[#A19791]">
                  09:03pm
                </span>
              </div>
            </div>
            <div>
              <img src="./assets/person9.png" alt="" />
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="flex-wrap-reverse flex flex-col">
          <p
            className="max-w-72 min-h-10 flex items-center px-2 text-white font-inter m-2 text-sm bg-[#FF731D] rounded-md"
          >
            {message}
          </p>
        </div>
      </div>
    );
  };

  const ReceivingMsg = () => {
    return (
      <div>
        {turn ? (
          <div>
            <img
              src={`http://127.0.0.1:8000${user.thumbnail_url}`}
              alt="person_profile"
            />
            <div className="w-full">
              <span className="font-inter font-semibold mt-2 m-2">
                {user.first_name} {user.last_name}
              </span>
              <span className="font-inter text-xs self-center text-[#A19791]">
                09:03pm
              </span>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div>
          <p
            className="max-w-72 min-h-10 flex items-center px-2 font-inter m-2 text-sm bg-[#F7F5F4] rounded-md"
          >
            {receivedMsg}
          </p>
        </div>
      </div>
    );
  };

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
      if (message != "") {
        const container = document.getElementById("chat-container");
        const customComponent = document.createElement("div");
        container.appendChild(customComponent);
        const root = createRoot(customComponent);
        root.render(<SendMsgComponent />);
        setTurn(true);
        setMessage("");
      }
      return socket;
    } else {
      console.error("WebSocket connection not open.");
      return null;
    }
  };
  useEffect(() => {
    const handleMessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.source === "realtime") {
        console.log("this is my data:", data.data.message);
        setReceivedMsg(data.data.message);
      }
    };

    if (socket) {
      socket.addEventListener("message", handleMessage);
    }
  }, []);

  useEffect(() => {
    if (receivedMsg != "") {
      const container = document.getElementById("chat-container");
      const customComponent = document.createElement("div");
      container.appendChild(customComponent);
      const root = createRoot(customComponent);
      root.render(<ReceivingMsg />);
    }
    setTurn(false);
  }, [receivedMsg]);
  return (
    <div className="  flex-1 flex-col h-screen dsff  flex   ">
      <div className="p-2 flex  h-24 shadow-md ">
        <div className="m-2  flex justify-center w-20 h-20 items-center ">
          <img className="absolute" src="./assets/ellipse_active.png" alt="" />
          <img
            src={`http://127.0.0.1:8000${user.thumbnail_url}`}
            className=""
            alt="person_profile"
          />
        </div>
        <div className=" flex-col p-5">
          <span className="font-bold text-xl truncate font-inter">
            {user.first_name} {user.last_name}
          </span>
        </div>
        <div className=" flex flex-1 justify-end items-center gap-5">
          <div className="w-[50px] h-[50px] rounded-full flex justify-center items-center bg-gray-400">
            <img src="./assets/video_call.png" alt="video_call" />
          </div>
          <div className="w-[50px] h-[50px] rounded-full flex justify-center items-center bg-gray-400">
            <img src="./assets/phone.png" alt="phone" />
          </div>
        </div>
      </div>

      <div className="overflow-y-scroll no-scrollbar h-full scroll-bottom" ref={chatContainerRef}>
        <div className=" p-2 h-full flex flex-col justify-between ">
          <div id="chat-container">
            <p className="font-inter text-center">Yesterday</p>
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
                console.log("Sending message:", message);
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
export default MainChat;
