import { useState } from "react";
import { ArrowLeftCircle, ArrowRightCircle } from "react-feather";

function UsernameAndAvatarModalavatarListelection () {

  const [selectedIndex, setSelectedIndex] = useState(0);
  const avatarList = new Array(9).fill(null);

  const handleavatarListelect = (index) => {
    setSelectedIndex(index);
  };

  const handleArrowClick = (direction) => {
    setSelectedIndex((prevIndex) => {
      return (prevIndex + direction + avatarList.length) % avatarList.length;
    });
  };
    
  return (
    <div className="flex flex-col gap-3.5 justify-center">
      <span className="text-zinc-500 flex items-center gap-2 justify-evenly">
        <ArrowLeftCircle
          onClick={() => handleArrowClick(-1)}
          className="cursor-pointer hover:scale-105 hover:text-zinc-700 hover:dark:text-zinc-400"
          aria-label="Previous avatar"
        />
        <span className="md:w-44 md:h-44 w-36 h-36 rounded-full border-2 bg-black border-blue-900"></span>
        <ArrowRightCircle
          onClick={() => handleArrowClick(1)}
          className="cursor-pointer hover:scale-105 hover:text-zinc-700 hover:dark:text-zinc-400" 
          aria-label="Next avatar"
        />
      </span>
              
      <div className="flex flex-wrap justify-center md:gap-3">
        {avatarList.map((_, index) => (
          <span
            key={index}
            onClick={() => handleavatarListelect(index)}
            className={`w-9 h-9 m-2 md:m-0 cursor-pointer bg-black rounded-full border-2 
            ${index === selectedIndex ? "border-blue-900" : "border-transparent"}`}
            aria-label={`Avatar ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default UsernameAndAvatarModalavatarListelection;