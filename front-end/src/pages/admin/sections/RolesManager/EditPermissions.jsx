import { useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PropTypes from "prop-types";

import queryClient from "@lib/queryClient";
import useNotification from "@hooks/useNotification";

import { Loader } from "react-feather";
import LabeledToggleSwitch from "@components/ui/LabeledToggleSwitch";
import ToggleSwitch from "@components/ui/ToggleSwitch";
import Button from "@components/ui/Button";

import updateRolePermissions from "@services/roles/updateRolePermissions";

EditPermissions.propTypes = {
  role: PropTypes.object.isRequired,
  handleEditRolePermissions: PropTypes.func.isRequired,
};

const permissionsList = [
  {
    name: "viewRooms",
    label: "View Rooms",
    description: "Allows users to view the list of available channels.",
    type: "boolean"
  },
  {
    name: "joinRooms",
    label: "Join Room",
    description: "Allows users to join or leave channels.",
    type: "boolean"
  },
  {
    name: "sendMessages",
    label: "Send Messages",
    description: "Allows users to send messages in channels or direct messages.",
    type: "boolean"
  },
  {
    name: "viewUserProfiles",
    label: "View User Profiles",
    description: "Allows users to view the profiles of other users.",
    type: "boolean"
  },
  {
    name: "editUserProfiles",
    label: "Edit User Profiles",
    description: "Allows users to edit their own profiles.",
    type: "boolean"
  },
  {
    name: "manageUsers",
    label: "Manage Users",
    description: "Allows users to create, edit, or delete users",
    type: "boolean"
  },
  {
    name: "manageRooms",
    label: "Manage Rooms",
    description: "Allows users to create, edit, or delete themes and chats.",
    type: "boolean"
  },
  {
    name: "manageRoles",
    label: "Manage Roles",
    description: "Allows users to create, edit, or delete roles and permissions.",
    type: "boolean"
  },
];

function EditPermissions ({ role, handleEditRolePermissions }) {
  const { handleNotification } = useNotification();

  const [ isLoadingOnSaving, setIsLoadingOnSaving ] = useState(false);

  const generateFormConfig = useCallback((permissionsList, rolePermissions) => {
    const schemaShape = {};
    const defaultValues = {};
  
    permissionsList.forEach(permission => {
      schemaShape[permission.name] = z.boolean();
      
      defaultValues[permission.name] = rolePermissions[permission.name] ?? false;
    });
  
    return {
      schema: zodResolver(z.object(schemaShape)),
      defaultValues
    };
  }, []);

  const { schema, defaultValues } = useMemo(() => generateFormConfig(permissionsList, role?.permissions || {}), [role?.permissions, generateFormConfig]);

  const { control, handleSubmit } = useForm({
    resolver: schema,
    defaultValues,
  });

  const editRolePermissionsMutation = useMutation({
    mutationFn: ({ role, data }) => updateRolePermissions(role, data),
    onSuccess: () => {
      setIsLoadingOnSaving(false);

      handleNotification({
        model: "success",
        message: "Role updated successfully.",
      });

      queryClient.invalidateQueries(["get-roles"]);
      handleEditRolePermissions();
    },
    onError: (error) => {
      setIsLoadingOnSaving(false);

      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred.",
      });
    },
  });

  const editRolePermissions = useCallback((data) => {
    setIsLoadingOnSaving(true);
    editRolePermissionsMutation.mutate({ role, data });
  }, [editRolePermissionsMutation, role]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center mx-2 md:m-0 bg-zinc-950/80">
      <div className="bg-zinc-100 dark:bg-zinc-900 rounded-xl p-5 flex flex-col gap-6 w-[460px] shadow-2xl">
        <p className="font-semibold font-alternates text-xl leading-snug text-zinc-900 dark:text-zinc-50">
          {`Edit Permissions - ${role.name}`}
        </p>
        <form onSubmit={handleSubmit(editRolePermissions)} className="flex flex-col gap-4">
          {permissionsList.map(permission => (
            <Controller
              key={permission.name}
              name={permission.name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <LabeledToggleSwitch labelText={permission.label} name={permission.name} description={permission.description} >
                  <ToggleSwitch
                    checked={value}
                    onChange={e => onChange(e.target.checked)}
                  />
                </LabeledToggleSwitch>
              )}
            />
          ))}
          

          <div className="flex justify-end items-center gap-2">
            <Button disabled={isLoadingOnSaving} size="sm" type="submit">
              {!isLoadingOnSaving ? (
                <>
                  Save
                </>
              ) : (
                <Loader className="animate-spin text-zinc-400" />    
              )}
            </Button>
            <Button size="sm" color="transparent" onClick={handleEditRolePermissions}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPermissions;