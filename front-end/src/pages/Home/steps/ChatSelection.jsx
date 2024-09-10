import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import useUser from "@hooks/useUser";
import useNotification from "@hooks/useNotification";

import { format } from "date-fns";

import { ArrowLeft } from "react-feather";
import ChatCard from "@components/ChatCard";
import CardSkeleton from "@components/skeleton/CardSkeleton";

import getChats from "@services/chats/getChats";
import getThemeByName from "@services/themes/getThemeByName";
import addUserChat from "@services/users/addUserChat";


ChatSelection.propTypes = {
  handleSelectTheme: PropTypes.func.isRequired,
  handleSelectChat: PropTypes.func.isRequired,
  setChat: PropTypes.func.isRequired,
};

function ChatSelection ({ handleSelectTheme, handleSelectChat, setChat }) {
  const { user } = useUser();
  const { handleNotification } = useNotification();

  const navigate = useNavigate();

  const [ searchParams ] = useSearchParams();
  const themeSelectedName = searchParams.get("theme");

  const [ themeSelected, setThemeSelected ] = useState(null);

  const fetchTheme = useCallback(async () => {
    if (!themeSelectedName) navigate("/");
  
    try {
      const theme = await getThemeByName(themeSelectedName);
      setThemeSelected(theme);
    } catch (error) {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred.",
      });
      navigate("/");
    }
  }, [themeSelectedName, handleNotification, navigate]);

  useEffect(() => {
    fetchTheme();
  }, [fetchTheme]);

  const { data: chats, isLoading: isChatsLoading } = useQuery({
    queryKey: ["get-chats", themeSelectedName],
    queryFn: () => getChats(themeSelected, 1, 10),
    enabled: !!themeSelected,
    retry: 2,
    onError: (error) => {
      handleNotification({
        model: "error", 
        message: error.message || "An unexpected error occurred."
      });
    }
  });

  const selectChat = async (chat) => {
    setChat(chat);

    if (!user) {
      handleSelectChat(chat);
      return;
    }

    try {
      const response = await addUserChat(chat);

      if (!response.user) {
        handleNotification({
          model: "error", 
          message: response.error || "An unexpected error occurred."
        });
        return;
      }
      navigate(`/c/${chat.name}`);
    } catch (error) {
      handleNotification({
        model: "error", 
        message: error.message || "An unexpected error occurred."
      });
    }
    
  };

  const backToThemeSelection = () => handleSelectTheme(null);

  return (
    <span className="flex flex-col lg:px-20 px-5 md:items-start">
      <div className="flex items-center lg:gap-6 gap-2">
        <span
          className="flex items-center gap-2 cursor-pointer"
          onClick={backToThemeSelection}
          aria-label="Back to theme selection"
        >
          <ArrowLeft className="dark:text-zinc-700 text-zinc-500 lg:w-6 lg:h-6 w-5 h-5" />
          <p className="dark:text-zinc-700 text-zinc-500 font-semibold lg:text-2xl text-xl leading-relaxed">back</p>
        </span>
        <h1 className="uppercase font-bold font-alternates lg:text-3xl text-2xl leading-relaxed text-zinc-900 dark:text-zinc-300">
          {themeSelected?.name}
        </h1>
      </div>

      <span className="flex gap-4 py-10 flex-wrap justify-center">
        {isChatsLoading && (
          [1, 2, 3, 4, 5].map((_, index) => (
            <CardSkeleton key={index} />
          )) 
        )}
        {chats && (
          chats.map(chat => (
            <ChatCard.Root key={chat.name} onClick={() => selectChat(chat)}>
              <ChatCard.Banner />
              <ChatCard.Content title={chat.name}>
                <ChatCard.Infos
                  onlineUsers={chat.online_users === 0 ? "No one on-line" : `${chat.online_users} on-line`}
                  createdAt={format(new Date(chat.created_at), "dd/MM/yyyy")}
                />
              </ChatCard.Content>
            </ChatCard.Root>
          )))}
      </span>
    </span>
  );
}

export default ChatSelection;
