import { useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import getRolePermissions from "@services/roles/getRolePermissions";

EditPermissions.propTypes = {
  role: PropTypes.object.isRequired,
  handleEditRolePermissions: PropTypes.func.isRequired,
};

function EditPermissions ({ role, handleEditRolePermissions }) {
  const { handleNotification } = useNotification();

  const [ isLoadingOnSaving, setIsLoadingOnSaving ] = useState(false);

  const { data: rolePermissions } = useQuery({
    queryKey: ["get-role-permissions", role.id],
    queryFn: () => getRolePermissions(role),
    onError: (error) => {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred."
      });
    },
  });

  const generateFormConfig = useCallback((permissions) => {
    const schemaShape = {};
    const defaultValues = {};

    permissions.forEach(permission => {
      if (permission.type === "boolean") {
        schemaShape[permission.name] = z.boolean();
        defaultValues[permission.name] = permission.value ?? false;
      } else if (permission.type === "number") {
        schemaShape[permission.name] = z.number().min(0);
        defaultValues[permission.name] = permission.value ?? 0;
      }
    });

    return {
      schema: zodResolver(z.object(schemaShape)),
      defaultValues
    };
  }, []);

  const { schema, defaultValues } = useMemo(
    () => generateFormConfig(rolePermissions || []),
    [rolePermissions, generateFormConfig]
  );

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
          {rolePermissions && rolePermissions?.map((permission) => (
            <Controller
              key={permission.name}
              name={permission.name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <>
                  {permission.type === "boolean" ? (
                    <LabeledToggleSwitch
                      labelText={permission.name}
                      name={permission.name}
                      description={permission.description}
                    >
                      <ToggleSwitch
                        checked={value}
                        onChange={(e) => onChange(e.target.checked)}
                      />
                    </LabeledToggleSwitch>
                  ) : (
                    <div className="flex flex-col gap-2 w-full">
                      <label
                        htmlFor={permission.name}
                        className="flex items-center justify-between gap-2"
                      >
                        <p className="text-zinc-700 dark:text-zinc-300 font-semibold">
                          {permission.name}
                        </p>
                        <input
                          type="number"
                          value={value}
                          onChange={(e) => onChange(Number(e.target.value))}
                          className="dark:bg-zinc-800 dark:text-zinc-400 bg-zinc-200 text-zinc-700 px-2 py-1 w-16 rounded-md"
                          min={0}
                        />
                      </label>
                      <p className="text-sm font-normal leading-5 dark:text-zinc-500 text-zinc-500">{permission.description}</p>
                    </div>
                  )}
                </>
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