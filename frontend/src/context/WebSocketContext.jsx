import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const access_token = localStorage.getItem("access_token");
      const socket = new WebSocket(
        `ws://127.0.0.1:8000/chat/?token_type=google&token=${access_token}`
      );

      socket.onopen = () => {
        console.log("Socket is open");
      };

      socket.onmessage = (event) => {
        console.log("Received message:", event.data);
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

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};
