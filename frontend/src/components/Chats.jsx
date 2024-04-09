import React, { useState, useEffect } from "react";
import Chat from "./Chat";
import MainChat from "./MainChat";
import { useAuth } from "../context/AuthContext";
import { useWebSocket } from "../context/WebSocketContext";
import { Link } from 'react-router-dom';
import data from "../data/data";
const Chats = () => {
  const { userData } = useAuth();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const { fetchUserList } = useWebSocket();
  const [showMainChat, setShowMainChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // useEffect(() => {
  //   if (query) {
  //     fetchUserList(query);
  //   }
  // }, [query]);

  useEffect(() => {
    const handleMessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "user_list") {
        setUsers(data.users);
      }
    };

    // Conditionally add event listener based on the query
    if (query) {
      const socket = fetchUserList(query);
      if (socket) {
        socket.addEventListener("message", handleMessage);
      }

      // Cleanup
      return () => {
        if (socket) {
          socket.removeEventListener("message", handleMessage);
        }
      };
    }
  }, [query]);

  return (
    <div className="flex flex-1 ">
      <div className="w-80 h-screen flex flex-col  bg-[rgb(247,245,244)] shadow-2xl">
        <div className="w-full  h-24 flex  items-center">
          <div className="m-5 flex">
            <div className="m-2 mr-5 flex justify-center items-center">
              <img className="absolute" src="./assets/ellipse.png" alt="" />
              <img
                src={userData ? userData.profilePhoto : null}
                className="rounded-full"
                alt="photo"
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
            <span className="absolute m-1 p-1 right-0">
              <img src="./assets/searchicon.png" alt="" />
            </span>
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="rounded-md w-full py-2 border-none focus:outline-none focus:ring-0 p-2"
            />
          </div>
          {query ? (
            <ul>
              {users.map((user) => (
                <li key={user.id}>
                  <div className="flex mt-5 cursor-pointer shadow-md rounded-md"  onClick={()=>{
                    setShowMainChat(true)
                    setSelectedUser(user)
                }}>
                  {user.thumbnail_url ? (
                    <img
                      src={`http://127.0.0.1:8000${user.thumbnail_url}`}
                      alt="profile_photo"
                    />
                  ) : (
                    <img
                      className="rounded-full"
                      src={`http://127.0.0.1:8000/media/avatars/blank.png`}
                      alt="profile_photo"
                    />
                  )}
                  
                  <span className="p-2 font-inter font-semibold">{user.first_name} {user.last_name}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="m-1 mt-5 gap-1 overflow-y-scroll no-scrollbar">
      {data.map((person, index) => {
        return (
          <div key={index} className="flex pb-4 mt-5 cursor-pointer shadow-md rounded-md " onClick={()=>{setShowMainChat(true)
          console.log('oh yeah')
          setSelectedUser(person)}}>
            <div>
              <img src={person.profile_img} alt="" />
            </div>
            <div className="flex justify-between flex-1 ml-2">
              <div className="font-inter font-semibold flex flex-col gap-2 mt-1">
                <span>{person.first_name}</span>
                <span className="text-[#A19791] text-xs font-normal">
                  {person.typing ? `${person.first_name} is typing` : null}
                </span>
              </div>
              {person.new_messages > 0 ? (
                <div className="bg-[#FF731D] text-white w-5 h-5 rounded-full flex items-center justify-center self-center font-public-sans text-xs">
                  {person.new_messages}
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        );
      })}
    </div>
          )}
        </div>
      </div>
      {showMainChat && selectedUser && <MainChat user={selectedUser} />}
    </div>
  );
};

export default Chats;
