import data from "../data/data";
const Chat = () => {
  return (
    <div className="m-1 mt-5 gap-1 overflow-y-scroll no-scrollbar">
      {data.map((person, index) => {
        return (
          <div key={index} className="flex  pb-4 ">
            <div>
              <img src={person.profile_img} alt="" />
            </div>
            <div className="flex justify-between flex-1 ml-2">
              <div className="font-inter font-semibold flex flex-col gap-2 mt-1">
                <span>{person.name}</span>
                <span className="text-[#A19791] text-xs font-normal">
                  {person.typing ? `${person.name} is typing` : null}
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
  );
};

export default Chat;
