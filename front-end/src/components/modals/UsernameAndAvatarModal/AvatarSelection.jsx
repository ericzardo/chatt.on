import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import useNotification from "@hooks/useNotification";

import { ArrowLeftCircle, ArrowRightCircle } from "react-feather";

import getAvatars from "@services/images/getAvatars";

UsernameAndAvatarModalAvatarSelection.propTypes = {
  selectedAvatar: PropTypes.number.isRequired,
  setSelectedAvatar: PropTypes.func.isRequired,
};

function UsernameAndAvatarModalAvatarSelection ({ selectedAvatar, setSelectedAvatar }) {
  const { handleNotification } = useNotification();

  const { data: avatars, isLoading: avatarsIsLoading } = useQuery({
    queryKey: ["get-avatars"],
    queryFn: () => getAvatars(),
    retry: 2,
    onError: (error) => {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred."
      });
    }
  });

  const handleArrowClick = (direction) => {
    setSelectedAvatar((prevIndex) => {
      return (prevIndex + direction + avatars?.length) % avatars?.length;
    });
  };

  if (avatarsIsLoading) {
    return <h1>Loading avatars...</h1>;
  }

  return (
    <div className="flex flex-col gap-3.5 justify-center">
      <span className="text-zinc-500 flex items-center gap-2 justify-evenly">
        <ArrowLeftCircle
          onClick={() => handleArrowClick(-1)}
          className="cursor-pointer hover:scale-105 hover:text-zinc-700 hover:dark:text-zinc-400"
          aria-label="Previous avatar"
        />
        {avatarsIsLoading ? (
          <h1>Loading...</h1>
        ): (
          <img
            src={avatars[selectedAvatar]}
            alt="Preview avatar selected"
            className="md:w-44 md:h-44 w-36 h-36 rounded-full border-2 border-blue-900"
          />
        )}
       
        <ArrowRightCircle
          onClick={() => handleArrowClick(1)}
          className="cursor-pointer hover:scale-105 hover:text-zinc-700 hover:dark:text-zinc-400" 
          aria-label="Next avatar"
        />
      </span>
              
      <div className="flex flex-wrap justify-center md:gap-3">
        {avatarsIsLoading ? (
          <h1>Loading...</h1>
        ) : (
          avatars.map((href, index) => (
            <img
              key={index}
              onClick={() => setSelectedAvatar(index)}
              src={href}
              alt={`Avatar ${index}`}
              aria-label={`Avatar ${index + 1}`}
              className={`w-9 h-9 m-2 md:m-0 cursor-pointer rounded-full border-2 
              ${index === selectedAvatar ? "border-blue-900" : "border-transparent"}`}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default UsernameAndAvatarModalAvatarSelection;