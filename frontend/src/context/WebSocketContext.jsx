import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { isAuthenticated,userData } = useAuth();
  const [conversationList,setConversationList] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      const access_token = localStorage.getItem("access_token");
      const socket = new WebSocket(
        `ws://127.0.0.1:8000/chat/?token_type=jwt&token=${access_token}`
      );

      socket.onopen = () => {
        console.log("Socket is open");
      };

      socket.onmessage = (event) => {
        // console.log("Received message:", event.data);
        const data = JSON.parse(event.data)
        if(data.source==='conversation_list'){
          // console.log('my list:',data.data);
          setConversationList(data.data);
        }
      };

      socket.onerror = (error) => {
        console.error("Socket error:", error);
      };

      socket.onclose = () => {
        console.log("Socket is closed");
      };

      setSocket(socket);

      // Clean up WebSocket on unmount
      return () => {
        if (socket) {
          socket.close();
        }
      };
    }
    else {
      // Close the WebSocket connection if the user is not logged in
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [isAuthenticated]);

  // Effect to send the message when userData changes
  useEffect(() => {
    if (userData && socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          source: "conversation_list",
          username: userData.user
        })
      );
    }
  }, [userData,conversationList]);

  const fetchUserList = (query) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = {
        type: 'get_user_list',
        query: query
      };
      socket.send(JSON.stringify(message));
      return socket; // Return the socket directly
    } else {
      console.error('WebSocket connection not open.');
      return null;
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, fetchUserList,conversationList,setConversationList }}>
      {children}
    </WebSocketContext.Provider>
  );
};
