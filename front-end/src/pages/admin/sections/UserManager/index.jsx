import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import useNotification from "@hooks/useNotification";

import queryClient from "@lib/queryClient";

import { Search, Edit3, X } from "react-feather";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import Table from "@components/ui/Table";
import RoleCard from "@components/RoleCard";
import ConfirmDeleteModal from "@components/modals/ConfirmDeleteModal";

import EditUserRolesModal from "./EditRolesModal";
import CreateUserModal from "./CreateUserModal";
import TableSkeleton from "@components/skeleton/TableSkeleton";

import getUsers from "@services/users/getUsers";
import deleteUser from "@services/users/deleteUser";

function UserManager () {
  const { handleNotification } = useNotification();
  const [ isCreateUserModalOpen, setIsCreateUserModalOpen ] = useState(false);
  const [ isToConfirmAction, setIsToConfirmAction ] = useState(false);
  const [ isEditRolesModalOpen, setIsEditRolesModalOpen ] = useState(false);
  const [ userSelected, setUserSelected ] = useState(null);

  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ["get-users"],
    queryFn: () => getUsers(1, 10),
    onError: (error) => {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred."
      });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: (user) => deleteUser(user),
    onSuccess: () => {
      handleNotification({
        model: "success",
        message: "User successfully deleted.",
      });

      queryClient.invalidateQueries(["get-users"]);
      handleConfirmDeleteModal();
    },
    onError: (error) => {
      console.log(error);
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred."
      });
    },
  });

  const confirmDeleteUser = (user) => {
    deleteUserMutation.mutate(user);
  };

  const handleCreateUserModal = useCallback(() => {
    setIsCreateUserModalOpen(prev => !prev);
  }, []);

  const handleConfirmDeleteModal = useCallback(() => {
    setIsToConfirmAction(prev => !prev);
  }, []);
  
  const handleEditRolesModal = useCallback((user) => {
    setUserSelected(user);
    setIsEditRolesModalOpen(prev => !prev);
  }, []);

  const handleDeleteUser = useCallback((user) => {
    setUserSelected(user);
    handleConfirmDeleteModal();
  }, [handleConfirmDeleteModal]);

  const columns = [
    { 
      header: "Username",
      render: (user) => (
        <span className="flex gap-2 items-center">
          <span className="w-8 h-8 m-2 md:m-0 bg-black rounded-full"></span>
          <span className="flex flex-col gap-1 flex-start">
            <p className="font-alternates font-semibold text-sm text-zinc-900 dark:text-zinc-300">
              {user.username}
            </p>
            <p className="font-alternates font-medium text-[10px] text-zinc-500 dark:text-zinc-500">{user.email}</p>
          </span>
                    
        </span>
      ) 
    },
    { 
      header: "User Roles",
      render: (user) => (
        <span className="flex gap-2">
          {user?.roles.map(role => (
            <RoleCard key={role.name} role={role} />
          ))}
        </span>
      )
    },
    { 
      header: "Actions",
      render: (user) => (
        <span className="flex items-center justify-between">
          <span onClick={() => handleEditRolesModal(user)} className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:dark:text-zinc-200 hover:text-zinc-950 transition-colors cursor-pointer">
            <Edit3 className="w-4 h-4" />
            <p className="text-sm font-medium">Edit Roles</p>
          </span>
          <X
            onClick={() => handleDeleteUser(user)}
            className="w-5 h-5 dark:text-red-700 text-red-500 flex items-center justify-center cursor-pointer transition-all hover:text-red-600 hover:dark:text-red-500 hover:scale-x-105"
          />
        </span>
      ) 
    },
  ];

  return (
    <div className="w-full px-4 py-6">
      <span className="flex justify-between gap-5 items-start sm:items-center user-manager-header">
        <h1 className="font-bold font-alternates md:text-3xl text-xl leading-relaxed text-zinc-900 dark:text-zinc-300">User Management</h1>
        <span className="flex sm:flex-row flex-col items-end sm:items-center gap-3 user-manager-header-action">
          {users && users.length > 0 && (
            <Input size="sm" placeholder="Search User" icon={<Search className="h-8 w-8 p-2" />} />
          )}
          <Button onClick={handleCreateUserModal} size="sm">
            Add User
          </Button>
        </span>
      </span>

      <div className="overflow-x-auto my-10 rounded-lg flex">
        {isUsersLoading || !users ? (
          <TableSkeleton columns={columns} />
        ) : users && users.length > 0 ? (
          <Table columns={columns} data={users} />
        ) : (
          <div className="mx-auto mt-60 font-bold font-alternates text-3xl text-zinc-800 dark:text-zinc-200">No users found</div>
        )}
        
      </div>

      {isCreateUserModalOpen && (
        <CreateUserModal handleCreateUserModal={handleCreateUserModal} />
      )}

      {isToConfirmAction && (
        <ConfirmDeleteModal
          item={userSelected}
          handleConfirmDeleteModal={handleConfirmDeleteModal}
          onConfirm={confirmDeleteUser}
        />
      )}

      {isEditRolesModalOpen && (
        <EditUserRolesModal
          user={userSelected}
          handleEditRolesModal={handleEditRolesModal}
        />
      )}
    </div>
  );
}

export default UserManager;