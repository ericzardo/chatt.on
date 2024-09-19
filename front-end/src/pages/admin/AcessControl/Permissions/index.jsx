import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Edit3, X } from "react-feather";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import queryClient from "@lib/queryClient";
import useNotification from "@hooks/useNotification";

import Button from "@components/ui/Button";
import Table from "@components/ui/Table";
import CreateModal from "@components/modals/ContainerModal";
import ConfirmDeleteModal from "@components/modals/ConfirmDeleteModal";
import TableSkeleton from "@components/skeleton/TableSkeleton";
import GenerateForm from "@components/utils/GenerateForm";

import getPermissions from "@services/permissions/getPermissions";
import deletePermission from "@services/permissions/deletePermission";
import createPermission from "@services/permissions/createPermission";

function PermissionsManager () {
  const { handleNotification } = useNotification();

  const [ isCreatePermissionModalOpen, setIsCreatePermissionModalOpen ] = useState(false);
  const [ isToConfirmAction, setIsToConfirmAction ] = useState(false);
  const [ permissionSelected, setPermissionSelected ] = useState(null);

  const { data: permissions, isLoading: isPermissionsLoading } = useQuery({
    queryKey: ["get-permissions"],
    queryFn: () => getPermissions(),
    onError: (error) => {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred."
      });
    },
  });

  const createPermissionMutation = useMutation({
    mutationFn: (permission) => createPermission(permission),
    onSuccess: () => {
      handleNotification({
        model: "success",
        message: "Permission created successfully.",
      });

      queryClient.invalidateQueries(["get-permissions"]);
      handleCreatePermissionModal();
    },
    onError: (error) => {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred.",
      });
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (permission) => deletePermission(permission),
    onSuccess: () => {
      handleNotification({
        model: "success",
        message: "Permission successfully deleted.",
      });

      queryClient.invalidateQueries(["get-permissions"]);
      handleConfirmDeleteModal();
    },
    onError: (error) => {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred.",
      });
    },
  });

  const confirmDeletePermission = useCallback((permission) => {
    deleteRoleMutation.mutate(permission);
  }, [deleteRoleMutation]);

  const createNewPermission = useCallback((permission) => {
    console.log(permission);
    createPermissionMutation.mutate(permission);
  }, [createPermissionMutation]);

  const handleCreatePermissionModal = useCallback(() => {
    setIsCreatePermissionModalOpen(prev => !prev);
  }, []);

  const handleConfirmDeleteModal = useCallback(() => {
    setIsToConfirmAction(prev => !prev);
  }, []);

  const handleDeletePermission = useCallback((role) => {
    setPermissionSelected(role);
    handleConfirmDeleteModal();
  }, [handleConfirmDeleteModal]);

  const columns = [
    { 
      header: "Name",
      render: (permission) => (
        <p className="font-alternates font-semibold text-sm text-zinc-900 dark:text-zinc-300">
          {permission.name}
        </p>
      ) 
    },
    { 
      header: "Description",
      render: (permission) => (
        <p className="font-alternates font-semibold text-sm text-zinc-600 dark:text-zinc-400">
          {permission.description}
        </p>
      )
    },
    { 
      header: "Actions",
      render: (permission) => (
        <span className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:dark:text-zinc-200 hover:text-zinc-950 transition-colors cursor-pointer">
            <Edit3 className="w-4 h-4 " />
            <p className="text-sm font-medium">Edit Permission</p>
          </span>
          <X
            onClick={() => handleDeletePermission(permission)}
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
        .min(4, "Name must be at least 4 characters long")
        .max(22, "Name must be at most 22 characters long"),
      description: z.string().optional(),
      type: z.string()
    })),
    defaultValues: {
      name: "",
      description: "",
      type: ""
    },
  });

  const formFields = [
    { name: "name", label: "Name", type: "text", placeholder: "Example: manageRooms" },
    { name: "description", label: "Description", type: "text", placeholder: "Brief description of the permission" },
    { name: "type", label: "Type", type: "select", options: [
      { value: "boolean", placeholder: "Boolean" },
      { value: "number", placeholder: "Number" }
    ]},
  ];

  return (
    <div className="w-full px-4 py-6">
      <span className="flex justify-between gap-5 items-start sm:items-center user-manager-header">
        <h1 className="font-bold font-alternates md:text-3xl text-xl leading-relaxed text-zinc-900 dark:text-zinc-300">Permissions</h1>
        <span className="flex items-center gap-3">
          <Button onClick={handleCreatePermissionModal} size="sm">
            Add Permission
          </Button>
        </span>

      </span>

      <div className="overflow-x-auto my-10 rounded-lg flex">
        {isPermissionsLoading || !permissions ? (
          <TableSkeleton columns={columns} />
        ) : permissions && permissions.length > 0 ? (
          <Table columns={columns} data={permissions} />
        ) : (
          <div className="mx-auto mt-60 font-bold font-alternates text-3xl text-zinc-800 dark:text-zinc-200">No permissions found</div>
        )}
        
      </div>

      {isCreatePermissionModalOpen && (
        <CreateModal title="Create new Permission">
          <GenerateForm
            useForm={formManager}
            fields={formFields} 
            onSubmit={createNewPermission}
            onClose={handleCreatePermissionModal}
            submitLabel="Create"
          />
        </CreateModal>
      )}
      {isToConfirmAction && (
        <ConfirmDeleteModal item={permissionSelected} handleConfirmDeleteModal={handleConfirmDeleteModal} onConfirm={confirmDeletePermission} />
      )}

    </div>
  );
}

export default PermissionsManager;