import React, { useRef, useEffect } from "react";
import { Zuck } from "zuck.js";
import "zuck.js/css";
import "zuck.js/skins/snapgram";

const Status = () => {
  const storiesRef = useRef(null);

  useEffect(() => {
    if (storiesRef.current) {
      const options = {}; // See ./src/options.ts
      const stories = new Zuck(storiesRef.current, options);

      const dummyStory = {
        id: "user1",
        photo: "./assets/group1.png",
        name: "User 1",
        link: "",
        lastUpdated: Date.now(), // Using current timestamp
        items: [
          {
            id: "story1",
            type: "photo",
            length: 5, // in seconds
            src: "./assets/person.png",
          },
          // Add more items as needed
        ],
      };

      // Add the dummy story to the stories component
      stories.add(dummyStory);
    }
  }, []);

  return <div  className="min-w-[20%] bg-[rgb(247,245,244)] shadow-2xl p-5">
    <p className="font-semibold text-gray-500 mb-5">Recent Status</p>
<div ref={storiesRef}></div>
  </div>;
};

export default Status;
