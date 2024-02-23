import React from "react";

const MainChat = () => {
  return (
    <div className="  flex-1 flex-col h-screen dsff  flex   ">
      <div className="p-2 flex  h-24 shadow-md ">
        <div className="m-2  flex justify-center w-20 h-20 items-center ">
          <img className="absolute" src="./assets/ellipse_active.png" alt="" />
          <img src="./assets/person1.png" className="" alt="" />
        </div>
        <div className=" flex-col p-5">
          <span className="font-bold text-xl truncate font-inter">
            Trilokesh Singh
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

      <div className="overflow-y-scroll no-scrollbar h-full">
        <div className=" p-2 h-full flex flex-col justify-between ">
          <div>
            <p className="font-inter text-center">Yesterday</p>
            <div className="flex gap-3 ">
              <div>
                <img src="./assets/person1.png" alt="" />
              </div>
              <div className="w-full ">
                <span className="font-inter font-semibold mt-2 m-2">
                  Trilokesh Singh
                </span>
                <span className="font-inter text-xs self-center  text-[#A19791]">
                  09:03pm
                </span>
                <p className="max-w-72 min-h-10 flex items-center px-2 font-inter m-2 text-sm bg-[#F7F5F4] rounded-md">
                  Hi
                </p>
                <p className="max-w-72 min-h-10 flex items-center px-2 font-inter m-2 text-sm bg-[#F7F5F4] rounded-md">
                  How are you?
                </p>
              </div>
            </div>
            
            <div className="flex flex-row-reverse gap-3">
              <div>
                <img src="./assets/person9.png" alt="" />
              </div>
              <div className="w-full   ">
                <div className="flex justify-end">
                  <span className="font-inter font-semibold mt-2 m-2">You</span>
                  <span className="font-inter text-xs self-center  text-[#A19791]">
                    09:03pm
                  </span>
                </div>
                <div className="flex-wrap-reverse flex flex-col">
                  <p className="max-w-72 min-h-10 flex items-center px-2 text-white font-inter m-2 text-sm bg-[#FF731D] rounded-md">
                    I am Good, What about you?
                  </p>
                  <p className="max-w-72 min-h-10 flex items-center px-2 text-white font-inter m-2 text-sm bg-[#FF731D] rounded-md">
                    When are you going to University?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6">
      <div className="relative mb-3 p-2">
        <div className="absolute inset-y-0  right-0 flex items-center gap-5 pointer-events-none">
          <img src="./assets/mic.png" alt="" />
          <img src="./assets/pic.png" alt="" />
          <img src="./assets/attachment.png" alt="" />
          <img src="./assets/send.png" alt="" />
        </div>
        <input
          type="text"
          id="input-group-1"
          className="bg-gray-50  border outline-neutral-400 border-gray-300 text-gray-900 max-w-[80%] w-full lg:max-w-[65%]  text-sm rounded-lg focus:ring-blue-500  block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
          placeholder="Your message"
        />
      </div>
      </div>
    </div>
  );
};
// bg-[rgb(247,245,244)]
export default MainChat;
