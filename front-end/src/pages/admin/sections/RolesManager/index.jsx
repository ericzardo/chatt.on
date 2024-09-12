import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Edit3, X, Settings } from "react-feather";
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

import EditRoleModal from "./EditRoleModal";
import EditPermissions from "./EditPermissions";

import getRoles from "@services/roles/getRoles";
import createRole from "@services/roles/createRole";
import deleteRole from "@services/roles/deleteRole";
import updateRolesLevels from "@services/roles/updateRolesLevels";

function RolesManager () {
  const { handleNotification } = useNotification();

  const [ isCreateRoleModalOpen, setIsCreateRoleModalOpen ] = useState(false);
  const [ isToConfirmAction, setIsToConfirmAction ] = useState(false);
  const [ isEditRoleOpen, setIsEditRoleOpen ] = useState(false);
  const [ isEditRolePermissionsOpen, setIsEditRolePermissionsOpen ] = useState(false);
  const [ roleSelected, setRoleSelected ] = useState(null);
  const [ rolesData, setRolesData ] = useState([]);
  const [ rolesOrderChange, setRolesOrderChange ] = useState(false);

  const { data: roles, isLoading: isRolesLoading, isSuccess } = useQuery({
    queryKey: ["get-roles"],
    queryFn: () => getRoles(),
    onError: (error) => {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred."
      });
    },
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

      queryClient.invalidateQueries(["get-roles"]);
      handleConfirmDeleteModal();
    },
    onError: (error) => {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred.",
      });
    },
  });

  const updateRolesLevelsMutation = useMutation({
    mutationFn: (data) => updateRolesLevels(data),
    onSuccess: () => {
      handleNotification({
        model: "success",
        message: "Roles hierarchy updated successfully.",
      });

      queryClient.invalidateQueries(["get-roles"]);
      setRolesOrderChange(false);
    },
    onError: (error) => {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred.",
      });
    },
  });

  const confirmDeleteRole = useCallback((role) => {
    deleteRoleMutation.mutate(role);
  }, [deleteRoleMutation]);

  const createNewRole = useCallback((role) => {
    role.level = rolesData.length;
    console.log(role);
    createRoleMutation.mutate(role);
  }, [createRoleMutation, rolesData]);

  const updateRolesHierarchy = useCallback(() => {
    updateRolesLevelsMutation.mutate(rolesData);
  }, [updateRolesLevelsMutation, rolesData]);

  const handleCreateRoleModal = useCallback(() => {
    setIsCreateRoleModalOpen(prev => !prev);
  }, []);

  const handleEditRole = useCallback((role) => {
    setRoleSelected(role);
    setIsEditRoleOpen(prev => !prev);
  }, []);

  const handleEditRolePermissions = useCallback((role) => {
    setRoleSelected(role);
    setIsEditRolePermissionsOpen(prev => !prev);
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
            style={{ backgroundColor: role?.color }}
            className={"w-3 h-3 flex items-center justify-center p-0.5 rounded-full"}
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
          <span onClick={() => handleEditRole(role)} className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:dark:text-zinc-200 hover:text-zinc-950 transition-colors cursor-pointer">
            <Edit3 className="w-4 h-4 " />
            <p className="text-sm font-medium">Edit Role</p>
          </span>
          <span onClick={() => handleEditRolePermissions(role)} className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:dark:text-zinc-200 hover:text-zinc-950 transition-colors cursor-pointer">
            <Settings className="w-4 h-4 " />
            <p className="text-sm font-medium">Edit Permissions</p>
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
        .min(4, "Name must be at least 4 characters long")
        .max(30, "Name must be at most 30 characters long"),
      color: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color code")
    })),
    defaultValues: {
      name: "",
      color: "#3b82f6",
    },
  });

  const formFields = [
    { name: "name", label: "Name", type: "text", placeholder: "Example: Moderator" },
    { name: "color", label: "Color", type: "color", placeholder: "" },
  ];

  const handleRolesReorder = useCallback((reorderedRoles) => {
    setRolesData([...reorderedRoles]);
    setRolesOrderChange(JSON.stringify(reorderedRoles) !== JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    if (isSuccess) {
      setRolesData(roles);
    }
  }, [isSuccess, roles]);

  return (
    <div className="w-full px-4 py-6">
      <span className="flex justify-between gap-5 items-start sm:items-center user-manager-header">
        <h1 className="font-bold font-alternates md:text-3xl text-xl leading-relaxed text-zinc-900 dark:text-zinc-300">Roles</h1>
        <span className="flex items-center gap-3">
          <Button onClick={handleCreateRoleModal} size="sm" color={`${rolesOrderChange ? "transparent" : "default"}`}>
            Add Role
          </Button>
          {rolesOrderChange && (
            <Button onClick={updateRolesHierarchy} size="sm">
              Save
            </Button>
          )}
        </span>

      </span>

      <div className="overflow-x-auto my-10 rounded-lg flex">
        {isRolesLoading || !roles ? (
          <TableSkeleton columns={columns} />
        ) : roles && roles.length > 0 ? (
          <Table columns={columns} data={rolesData} onReorder={handleRolesReorder} draggable={true} />
        ) : (
          <div className="mx-auto mt-60 font-bold font-alternates text-3xl text-zinc-800 dark:text-zinc-200">No roles found</div>
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

      {isEditRoleOpen && (
        <EditRoleModal role={roleSelected} handleEditRole={handleEditRole} />
      )}

      {isEditRolePermissionsOpen && (
        <EditPermissions role={roleSelected} handleEditRolePermissions={handleEditRolePermissions} />
      )}
    </div>
  );
}

export default RolesManager;