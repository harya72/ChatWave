import React, { useState } from "react";
import Chats from "./Chats";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiLogOut } from "react-icons/fi";
import { Button } from "flowbite-react";

const Navigation = () => {
  const { logout } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);

  return (
    <>
      <div className="flex  h-full drop-shadow-lg">
        <div className="drop-shadow-2xl">
          <div className="w-20 h-screen items-center bg-gray-400   flex flex-col drop-shadow-2xl    ">
            <div className="m-10 flex justify-center">
              {/* <Link to="/dashboard" className="absolute"> */}
              <div className="absolute cursor-pointer" onClick={()=>setShowDashboard(true)}>
                <img src="./assets/fire.png" alt="home" className="" />
              </div>
              {/* </Link> */}
            </div>
            <p className="font-semibold text-sm text-white text-center">
              Dashboard
            </p>
            <div className="flex flex-col items-center justify-evenly h-3/4 w-full">
              <div className="flex flex-col justify-center items-center">
                <img src="./assets/menu.png" alt="" className="text-white" />
                <p className="font-semibold text-sm text-white text-center">
                  Menu
                </p>
              </div>
              <div className=" flex justify-center items-center flex-col">
                <div
                  className={`rounded-full w-10 h-10 flex justify-center items-center cursor-pointer ${
                    !showDashboard ? "bg-[#FF731D]" : ""
                  }`}
                  onClick={() => {
                    setShowDashboard(!showDashboard);
                  }}
                >
                  <img src="./assets/messages.png" alt="" />
                </div>
                <p className="font-semibold text-sm text-white text-center">
                  Messages
                </p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <img src="./assets/people.png" alt="" />
                <p className="font-semibold text-sm text-white text-center">
                  People
                </p>
              </div>
              {/* <div>
                <img src="./assets/phone.png" alt="" />
              </div> */}
              {/* <div>
                <img src="./assets/favorites.png" alt="" />
              </div> */}
              {/* <div>
                <img src="./assets/info.png" alt="" />
              </div> */}
            </div>
            <div className="flex flex-col justify-center items-center">
              <button
                onClick={() => setOpenModal(true)}
                className="rounded-full hover:bg-gray-500 "
              >
                <img src="./assets/logout.png" alt="LogOut" className=" " />
              </button>
              <p className="font-semibold text-sm text-white text-center">
                Logout
              </p>
            </div>
          </div>
        </div>
        {!showDashboard ? (
          <Chats />
        ) : (
          <>
            <div className="flex flex-col items-center w-full   ">
              <img
                src="./assets/chatbackground-removebg-preview.png"
                className=" w-[50%] mt-32 "
                alt="Image"
              />
              <p className="flex-wrap max-w-80 font-semibold text-center text-lg text-gray-700">
                Welcome to ChatWave!
                <br /> Get ready to connect with friends and family in a whole
                new way.
              </p>
            </div>
          </>
        )}
      </div>
      {openModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col items-center justify-center w-1/2 bg-white rounded-lg p-8">
            <FiLogOut className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to log out?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                className="bg-[#FF731D] px-2 font-semibold"
                onClick={() => {
                  logout();
                  console.log("see ya");
                }}
              >
                Logout
              </Button>
              <Button
                color="gray"
                className="text-[#FF731D] font-medium  px-2 "
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
