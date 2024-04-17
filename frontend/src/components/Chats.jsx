import React, { useState, useEffect } from "react";
import MainChat from "./MainChat";
import { useAuth } from "../context/AuthContext";
import { useWebSocket } from "../context/WebSocketContext";
const Chats = () => {
  const { userData } = useAuth();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const { fetchUserList, socket, conversationList } = useWebSocket();
  const [showMainChat, setShowMainChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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
                  <div
                    className="flex mt-5 cursor-pointer shadow-md rounded-md"
                    onClick={() => {
                      setShowMainChat(true);
                      setSelectedUser(user);
                    }}
                  >
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

                    <span className="p-2 font-inter font-semibold">
                      {user.first_name} {user.last_name}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="m-1 mt-5 gap-1 overflow-y-scroll no-scrollbar">
              {conversationList.map((person, index) => {
                const formatedTimeString = new Date(person.last_message.time);
                const formattedTime = formatedTimeString.toLocaleString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });
                return (
                  <div
                    key={index}
                    className="flex pb-4 mt-5 cursor-pointer shadow-md rounded-md "
                    onClick={() => {
                      setShowMainChat(true);
                      setSelectedUser(person);
                    }}
                  >
                    <div>
                    {person.thumbnail_url ? (
                      <img
                        src={`http://127.0.0.1:8000${person.thumbnail_url}`}
                        alt="profile_photo"
                      />
                    ) : (
                      <img
                        className="rounded-full"
                        src={`http://127.0.0.1:8000/media/avatars/blank.png`}
                        alt="profile_photo"
                      />
                    )}
                    </div>
                    <div className="flex justify-between flex-1 ml-2">
                      <div className="font-inter font-semibold flex flex-col gap-2 mt-1">
                        <span>{person.username}</span>
                        <span className="text-[#A19791] text-sm font-normal">
                          {person.last_message.text
                            ? `${person.last_message.text}`
                            : null}
                        </span>
                      </div>
                      {person.last_message.time ? (
                        <div className=" text-[#A19791]  h-5  self-start pt-2 font-public-sans text-xs">
                          {formattedTime}
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
