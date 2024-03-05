import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );
  const { updateUser } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (token) {
          const response = await axios.get("http://localhost:8000", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = localStorage.getItem("userData");

          updateUser({
            username: data ? JSON.parse(data).username : response.data.username,
            profilePhoto: data
              ? JSON.parse(data).profilePhoto
              : response.data.avatar_url,
            // ... other user data
          });

          login();
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Token is invalid or expired, attempt refresh
          console.log(
            "Token is expired or invalid, trying to refresh the token"
          );
          await handleTokenRefresh();
        } else {
          console.error("Error during initial fetch:", error);
          logout();
        }
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("refresh_token");
      const access_token = localStorage.getItem("access_token");
      if (token) {
        const response = await axios.post(
          "http://localhost:8000/logout/",
          {
            refresh_token: token,
          },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status == 205) {
          localStorage.clear();
          setIsAuthenticated(false);
        }
      } else {
        localStorage.clear();
        console.error("Logout failed");
      }
    } catch (error) {
      localStorage.clear()
      setIsAuthenticated(false)
      console.error("Error during logout:", error);
    }
  };

  const handleTokenRefresh = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/token/refresh/",
        {
          refresh: localStorage.getItem("refresh_token"),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data["access"]}`;
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        console.log("Token refreshed successfully");
        login(); // Login after successful token refresh
      }
    } catch (refreshError) {
      console.error("Error refreshing token:", refreshError);
      logout(); // Log out if token refresh fails
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
