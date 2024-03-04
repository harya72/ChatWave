import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="832907624457-68j9c73a8msdpf4q7qpaj1jlnmfh5mhs.apps.googleusercontent.com">
    {/* <React.StrictMode> */}
    <App />
    {/* </React.StrictMode> */}
  </GoogleOAuthProvider>
);
