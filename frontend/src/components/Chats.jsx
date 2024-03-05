import React from "react";
import Chat from "./Chat";
import MainChat from "./MainChat";
import { useUser } from "../context/UserContext";
const Chats = () => {
  const { userData } = useUser();
  return (
    <div className="flex flex-1 ">
      <div className="w-80 h-screen flex flex-col  bg-[rgb(247,245,244)] shadow-2xl">
        <div className="w-full  h-24 flex  items-center">
          <div className="m-5 flex">
            <div className="m-2 mr-5 flex justify-center items-center">
              <img className="absolute" src="./assets/ellipse.png" alt="" />
              <img
                src={
                  userData
                    // ? `http://localhost:8000/${userData.profilePhoto}`
                    ? userData.profilePhoto
                    : null
                }
                className="rounded-full"
                alt="profile_photo"
              />
            </div>
            <div className="flex flex-col p-5">
              <span className="font-bold text-xl truncate font-inter">
                {userData ? userData.username : "username"}
              </span>
              <span className="text-[#A19791] text-sm font-inter">
                My Account
              </span>
            </div>
          </div>
        </div>
        <div className="p-3 h-full  flex flex-col overflow-hidden">
          <div className="flex m-2 justify-between items-center">
            <div>
              <h2 className="font-inter">Messages</h2>
            </div>
            <div className=" flex gap-3">
              <div>
                <img src="./assets/edit.png" alt="edit" />
              </div>
              <div>
                <img src="./assets/heart.png" alt="edit" />
              </div>
            </div>
          </div>
          <div className="relative">
            <span className="absolute m-1 right-0">
              <img src="./assets/searchicon.png" alt="" />
            </span>
            <input
              type="text"
              placeholder="Search"
              className="rounded-md w-full py-2 border-none focus:outline-none focus:ring-0"
            />
          </div>
          <Chat />
        </div>
      </div>
      <MainChat />
    </div>
  );
};

export default Chats;
