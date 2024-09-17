import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { format } from "date-fns";
import useNotification from "@hooks/useNotification";
import queryClient from "@lib/queryClient";

import { Edit3, X } from "react-feather";
import Button from "@components/ui/Button";
import Table from "@components/ui/Table";
import CreateModal from "@components/modals/ContainerModal";
import ConfirmDeleteModal from "@components/modals/ConfirmDeleteModal";
import TableSkeleton from "@components/skeleton/TableSkeleton";
import GenerateForm from "@components/utils/GenerateForm";

import getThemes from "@services/themes/getThemes";
import getChats from "@services/chats/getChats";
import createChat from "@services/chats/createChat";
import deleteChat from "@services/chats/deleteChat";

function ChatsManager () {
  const { handleNotification } = useNotification();

  const [ searchParams, setSearchParams ] = useSearchParams();

  const [ isCreateChatModalOpen, setIsCreateChatModalOpen ] = useState(false);
  const [ isToConfirmAction, setIsToConfirmAction ] = useState(false);
  const [ isLoadingOnCreation, setIsLoadingOnCreation] = useState(false);

  const { data: themes } = useQuery({
    queryKey: ["get-themes"],
    queryFn: () => getThemes(1, 10),
    onError: (error) => {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred."
      });
    }
  });
  const selectedThemeName = searchParams.get("theme");

  const [ themeSelected, setThemeSelected ] = useState();
  const [ chatSelected, setChatSelected ] = useState();

  useEffect(() => {
    if (themes && themes.length > 0 && selectedThemeName) {
      const foundTheme = themes.find((theme) => theme.name === selectedThemeName);
      setThemeSelected(foundTheme || null);
    }
  }, [themes, selectedThemeName]);

  const { data: chats, isLoading: isChatsLoading } = useQuery({
    queryKey: ["get-chats", selectedThemeName],
    queryFn: () => getChats(themeSelected, 1, 10),
    enabled: !!themeSelected,
    onError: (error) => {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred."
      });
    }
  });

  const createChatMutation = useMutation({
    mutationFn: ({ themeSelected, data}) => createChat(themeSelected, data),
    onSuccess: () => {
      setIsLoadingOnCreation(false);
      
      handleNotification({
        model: "success",
        message: "Chat created successfully.",
      });

      queryClient.invalidateQueries(["get-chats"]);
      handleCreateChatModal();
    },
    onError: (error) => {
      setIsLoadingOnCreation(false);

      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred.",
      });
    },
  });

  const deleteChatMutation = useMutation({
    mutationFn: ({ themeSelected, chat }) => deleteChat(themeSelected, chat),
    onSuccess: () => {
      handleNotification({
        model: "success",
        message: "Chat successfully deleted.",
      });

      queryClient.invalidateQueries(["get-chats"]);
      handleConfirmDeleteModal();
    },
    onError: (error) => {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred.",
      });
    },
  });

  const confirmDeleteChat = (chat) => {
    deleteChatMutation.mutate({ themeSelected, chat });
  };

  const createNewChat = (data) => {
    setIsLoadingOnCreation(true);
    createChatMutation.mutate({ themeSelected, data });
  };

  const handleCreateChatModal = useCallback(() => {
    if (!themeSelected) return;
    setIsCreateChatModalOpen(prev => !prev);
  }, [themeSelected]);

  const handleConfirmDeleteModal = useCallback(() => {
    setIsToConfirmAction(prev => !prev);
  }, []);

  const handleDeleteChat = useCallback((chat) => {
    setChatSelected(chat);
    handleConfirmDeleteModal();
  }, [handleConfirmDeleteModal]);

  const handleThemeSelection = useCallback((event) => {
    const themeName = event.target.value;
    const selectedTheme = themes.find(theme => theme.name === themeName);
  
    searchParams.set("theme", themeName);

    setSearchParams(searchParams);
    setThemeSelected(selectedTheme);
  }, [searchParams, setSearchParams, themes]);
  
  const columns = [
    { 
      header: "Name",
      render: (chat) => (
        <p className="font-alternates font-semibold text-sm text-zinc-900 dark:text-zinc-300">
          {chat.name}
        </p>
      ) 
    },
    { 
      header: "Participants",
      render: (chat) => (
        <p className="font-alternates font-semibold text-sm text-zinc-900 dark:text-zinc-300">
          {chat.online_users}
        </p>
      )
    },
    {
      header: "Creation Date",
      render: (chat) => (
        <p className="font-alternates font-semibold text-sm text-zinc-900 dark:text-zinc-300">
          {format(new Date(chat.created_at), "dd/MM/yyyy")}
        </p>
      ) 
    },
    { 
      header: "Actions",
      render: (chat) => (
        <span className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:dark:text-zinc-200 hover:text-zinc-950 transition-colors cursor-pointer">
            <Edit3 className="w-4 h-4 " />
            <p className="text-sm font-medium">Edit Room</p>
          </span>
          <X
            onClick={() => handleDeleteChat(chat)}
            className="w-5 h-5 dark:text-red-700 text-red-500 flex items-center justify-center cursor-pointer transition-all hover:text-red-600 hover:dark:text-red-500 hover:scale-x-105"
          />
        </span>
      ) 
    },
  ];

  const formManager = useForm({
    resolver: zodResolver(z.object({
      name: z
        .string()
        .min(3, "Name must be at least 3 characters long")
        .max(30, "Name must be at most 30 characters long"),
    })),
    defaultValues: {
      name: "",
    },
  });

  const formFields = [{ name: "name", label: "Name", type: "text", placeholder: "Example: Astronomy" }];

  return (
    <div className="w-full px-4 py-6">
      <span className="flex justify-between gap-5 items-start sm:items-center user-manager-header">
        <h1 className="font-bold font-alternates md:text-3xl text-xl leading-relaxed text-zinc-900 dark:text-zinc-300">Chats Management</h1>
        <span className="flex sm:flex-row flex-col items-end sm:items-center gap-3 user-manager-header-action">
          {themes && themes.length > 0 && (
            <select 
              className="flex items-center gap-3 h-max w-max p-1.5 cursor-pointer font-semibold rounded-lg
            bg-zinc-300 text-zinc-600 dark:bg-zinc-800 dark:placeholder-zinc-700 dark:text-zinc-500"
              defaultValue={searchParams.get("theme") ? searchParams.get("theme") : "placeholder"}
              onChange={handleThemeSelection}
            >
              <option value="placeholder" disabled>Theme</option>
              {themes.map(theme => (
                <option key={theme.name} value={theme.name}>{theme.name}</option>
              ))}
            </select>
          )}
          {selectedThemeName && (
            <Button onClick={handleCreateChatModal} size="sm">
              Add Room
            </Button>
          )}
          
        </span>
      </span>

      <div className="overflow-x-auto my-10 rounded-lg flex">
        {isChatsLoading || !chats && themeSelected ? (
          <TableSkeleton columns={columns} />
        ) : !selectedThemeName && themes && themes.length > 0 ? (
          <div className="mx-auto mt-60 text-center font-bold font-alternates text-3xl text-zinc-800 dark:text-zinc-200">Select the theme to view the chats</div>
        ) : chats && chats.length > 0 ? (
          <Table columns={columns} data={chats} />
        ) : themes && themes.length == 0 ? (
          <div className="mx-auto mt-60 text-center font-bold font-alternates text-3xl text-zinc-800 dark:text-zinc-200">There is no themes created in our database</div>
        ) : (
          <div className="mx-auto mt-60 text-center font-bold font-alternates text-3xl text-zinc-800 dark:text-zinc-200">No chats found in this theme</div>
        )}
      </div>

      {isCreateChatModalOpen && (
        <CreateModal title="Create new Room" >
          <GenerateForm
            fields={formFields}
            useForm={formManager}
            onSubmit={createNewChat}
            onClose={handleCreateChatModal}
            isLoading={isLoadingOnCreation}
          />
        </CreateModal>
      )}

      {isToConfirmAction && (
        <ConfirmDeleteModal item={chatSelected} handleConfirmDeleteModal={handleConfirmDeleteModal} onConfirm={confirmDeleteChat} />
      )}


    </div>
  );
}

export default ChatsManager;