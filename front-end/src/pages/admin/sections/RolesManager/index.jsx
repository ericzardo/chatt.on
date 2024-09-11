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

import getRoles from "@services/roles/getRoles";
import createRole from "@services/roles/createRole";
import deleteRole from "@services/roles/deleteRole";

function RolesManager () {
  const { handleNotification } = useNotification();

  const [ isCreateRoleModalOpen, setIsCreateRoleModalOpen ] = useState(false);
  const [ isToConfirmAction, setIsToConfirmAction ] = useState(false);
  const [ roleSelected, setRoleSelected ] = useState(null);

  const { data: roles, isLoading: isRolesLoading } = useQuery({
    queryKey: ["get-roles"],
    queryFn: () => getRoles(),
    onError: (error) => {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred."
      });
    }
  });

  const createRoleMutation = useMutation({
    mutationFn: (role) => createRole(role),
    onSuccess: () => {
      handleNotification({
        model: "success",
        message: "Role created successfully.",
      });

      queryClient.invalidateQueries(["get-roles"]);
      handleCreateRoleModal();
    },
    onError: (error) => {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred.",
      });
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (role) => deleteRole(role),
    onSuccess: () => {
      handleNotification({
        model: "success",
        message: "Role successfully deleted.",
      });

      queryClient.invalidateQueries(["get-themes"]);
      handleCreateRoleModal();
    },
    onError: (error) => {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred.",
      });
    },
  });

  const confirmDeleteRole = (role) => {
    deleteRoleMutation.mutate(role);
  };

  const createNewRole = (role) => {
    createRoleMutation.mutate(role);
  };

  const handleCreateRoleModal = useCallback(() => {
    setIsCreateRoleModalOpen(prev => !prev);
  }, []);

  const handleConfirmDeleteModal = useCallback(() => {
    setIsToConfirmAction(prev => !prev);
  }, []);

  const handleDeleteRole = useCallback((role) => {
    setRoleSelected(role);
    handleConfirmDeleteModal();
  }, [handleConfirmDeleteModal]);

  const columns = [
    { 
      header: "Roles",
      render: (role) => (
        <span className="flex items-center gap-2">
          <span
            className={`w-3 h-3 flex items-center justify-center p-0.5 bg-${role.color}-500 rounded-full`}
          ></span>
          <p className="font-alternates font-semibold text-sm capitalize text-zinc-900 dark:text-zinc-300">
            {role.name}
          </p>
        </span>
        
      ) 
    },
    { 
      header: "Members",
      render: (role) => (
        <p className="font-alternates font-semibold text-sm text-zinc-900 dark:text-zinc-300">
          {role?.users?.length || 0}
        </p>
      )
    },
    { 
      header: "Actions",
      render: (role) => (
        <span className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:dark:text-zinc-200 hover:text-zinc-950 transition-colors cursor-pointer">
            <Edit3 className="w-4 h-4 " />
            <p className="text-sm font-medium">Edit Role</p>
          </span>
          <X
            onClick={() => handleDeleteRole(role)}
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
  const formFields = [{ name: "name", label: "Name", type: "text", placeholder: "Example: Moderator" }];

  return (
    <div className="w-full px-4 py-6">
      <span className="flex justify-between gap-5 items-start sm:items-center user-manager-header">
        <h1 className="font-bold font-alternates md:text-3xl text-xl leading-relaxed text-zinc-900 dark:text-zinc-300">Roles Management</h1>
        <span className="flex sm:flex-row flex-col items-end sm:items-center gap-3 user-manager-header-action">
          {roles && roles.length > 0 && (
            <Input size="sm" placeholder="Search Roles" icon={<Search className="h-8 w-8 p-2" />} />
          )}
          
          <Button onClick={handleCreateRoleModal} size="sm">
            Add Role
          </Button>
        </span>
      </span>

      <div className="overflow-x-auto my-10 rounded-lg flex">
        {isRolesLoading || !roles ? (
          <TableSkeleton columns={columns} />
        ) : roles && roles.length > 0 ? (
          <Table columns={columns} data={roles} />
        ) : (
          <div className="mx-auto mt-60 font-bold font-alternates text-3xl text-zinc-800 dark:text-zinc-200">No themes found</div>
        )}
        
      </div>

      {isCreateRoleModalOpen && (
        <CreateModal title="Create new Role">
          <GenerateForm
            useForm={formManager}
            fields={formFields} 
            onSubmit={createNewRole}
            onClose={handleCreateRoleModal}
            submitLabel="Create"
          />
        </CreateModal>
      )}
      {isToConfirmAction && (
        <ConfirmDeleteModal item={roleSelected} handleConfirmDeleteModal={handleConfirmDeleteModal} onConfirm={confirmDeleteRole} />
      )}
    </div>
  );
}

export default RolesManager;