import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Search, Edit3, X } from "react-feather";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import queryClient from "@lib/queryClient";
import useNotification from "@hooks/useNotification";

import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import Table from "@components/ui/Table";
import CreateModal from "@components/modals/ContainerModal";
import ConfirmDeleteModal from "@components/modals/ConfirmDeleteModal";
import TableSkeleton from "@components/skeleton/TableSkeleton";
import GenerateForm from "@components/utils/GenerateForm";

import getThemes from "@services/themes/getThemes";
import createTheme from "@services/themes/createTheme";
import deleteTheme from "@services/themes/deleteTheme";

function ThemesManager () {
  const { handleNotification } = useNotification();

  const [ isCreateThemeModalOpen, setIsCreateThemeModalOpen ] = useState(false);
  const [ isToConfirmAction, setIsToConfirmAction ] = useState(false);
  const [ themeSelected, setThemeSelected ] = useState(null);

  const [ isLoadingOnCreation, setIsLoadingOnCreation ] = useState(false);


  const { data: themes, isLoading: isThemesLoading } = useQuery({
    queryKey: ["get-themes"],
    queryFn: () => getThemes(1, 10),
    onError: (error) => {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred."
      });
    }
  });

  const createThemeMutation = useMutation({
    mutationFn: (theme) => createTheme(theme),
    onSuccess: () => {
      setIsLoadingOnCreation(false);

      handleNotification({
        model: "success",
        message: "Theme created successfully.",
      });

      queryClient.invalidateQueries(["get-themes"]);
      handleCreateThemeModal();
    },
    onError: (error) => {
      setIsLoadingOnCreation(false);

      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred.",
      });
    },
  });

  const deleteThemeMutation = useMutation({
    mutationFn: (theme) => deleteTheme(theme),
    onSuccess: () => {
      handleNotification({
        model: "success",
        message: "Theme successfully deleted.",
      });

      queryClient.invalidateQueries(["get-themes"]);
      handleConfirmDeleteModal();
    },
    onError: (error) => {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred.",
      });
    },
  });

  const confirmDeleteTheme = (theme) => {
    deleteThemeMutation.mutate(theme);
  };

  const createNewTheme = (theme) => {
    setIsLoadingOnCreation(true);
    createThemeMutation.mutate(theme);
  };

  const handleCreateThemeModal = useCallback(() => {
    setIsCreateThemeModalOpen(prev => !prev);
  }, []);

  const handleConfirmDeleteModal = useCallback(() => {
    setIsToConfirmAction(prev => !prev);
  }, []);

  const handleDeleteTheme = useCallback((theme) => {
    setThemeSelected(theme);
    handleConfirmDeleteModal();
  }, [handleConfirmDeleteModal]);

  const columns = [
    { 
      header: "Name",
      render: (theme) => (
        <p className="font-alternates font-semibold text-sm text-zinc-900 dark:text-zinc-300">
          {theme.name}
        </p>
      ) 
    },
    { 
      header: "Number of Chats",
      render: (theme) => (
        <p className="font-alternates font-semibold text-sm text-zinc-900 dark:text-zinc-300">
          {theme.number_of_chats}
        </p>
      )
    },
    { 
      header: "Actions",
      render: (theme) => (
        <span className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:dark:text-zinc-200 hover:text-zinc-950 transition-colors cursor-pointer">
            <Edit3 className="w-4 h-4 " />
            <p className="text-sm font-medium">Edit Theme</p>
          </span>
          <X
            onClick={() => handleDeleteTheme(theme)}
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
  const formFields = [{ name: "name", label: "Name", type: "text", placeholder: "Example: Science" }];

  return (
    <div className="w-full px-4 py-6">
      <span className="flex justify-between gap-5 items-start sm:items-center user-manager-header">
        <h1 className="font-bold font-alternates md:text-3xl text-xl leading-relaxed text-zinc-900 dark:text-zinc-300">Themes Management</h1>
        <span className="flex sm:flex-row flex-col items-end sm:items-center gap-3 user-manager-header-action">
          {themes && themes.length > 0 && (
            <Input size="sm" placeholder="Find a theme" icon={<Search className="h-8 w-8 p-2" />} />
          )}
          
          <Button onClick={handleCreateThemeModal} size="sm">
            Add Theme
          </Button>
        </span>
      </span>

      <div className="overflow-x-auto my-10 rounded-lg flex">
        {isThemesLoading || !themes ? (
          <TableSkeleton columns={columns} />
        ) : themes && themes.length > 0 ? (
          <Table columns={columns} data={themes} />
        ) : (
          <div className="mx-auto mt-60 font-bold font-alternates text-3xl text-zinc-800 dark:text-zinc-200">No themes found</div>
        )}
        
      </div>

      {isCreateThemeModalOpen && (
        <CreateModal title="Create new Theme">
          <GenerateForm
            useForm={formManager}
            fields={formFields} 
            onSubmit={createNewTheme}
            onClose={handleCreateThemeModal}
            submitLabel="Create"
            isLoading={isLoadingOnCreation}
          />
        </CreateModal>
      )}
      {isToConfirmAction && (
        <ConfirmDeleteModal item={themeSelected} handleConfirmDeleteModal={handleConfirmDeleteModal} onConfirm={confirmDeleteTheme} />
      )}
    </div>
  );
}

export default ThemesManager;