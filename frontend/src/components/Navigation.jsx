import React from "react";
import Chats from "./Chats";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navigation = () => {
  const { logout } = useAuth();

  return (
    <>
      <div className="flex  h-full drop-shadow-lg">
        <div className="drop-shadow-2xl">
          <div className="w-20 h-screen items-center bg-gray-400   flex flex-col drop-shadow-2xl    ">
            <div className="m-10 flex justify-center">
              <Link to="/dashboard" className="absolute">
                <img
                  src="./assets/fire.png"
                  alt="home"
                  className=""
                />
              </Link>
            </div>
            <div className="flex flex-col items-center justify-evenly h-3/4 w-full">
              <div>
                <img src="./assets/menu.png" alt="" className="text-white" />
              </div>
              <div className="bg-[#FF731D] rounded-full w-10 h-10 flex justify-center items-center">
                <img src="./assets/messages.png" alt="" />
              </div>
              <div>
                <img src="./assets/people.png" alt="" />
              </div>
              <div>
                <img src="./assets/phone.png" alt="" />
              </div>
              <div>
                <img src="./assets/favorites.png" alt="" />
              </div>
              <div>
                <img src="./assets/info.png" alt="" />
              </div>
            </div>
            <div>
              <button
                onClick={logout}
                className="rounded-full hover:bg-gray-500 "
              >
                <img src="./assets/logout.png" alt="LogOut" className=" " />
              </button>
            </div>
          </div>
        </div>
        <Chats />
      </div>
    </>
  );
};

export default Navigation;
