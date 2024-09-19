import { useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PropTypes from "prop-types";

import queryClient from "@lib/queryClient";
import useNotification from "@hooks/useNotification";

import LabeledToggleSwitch from "@components/ui/LabeledToggleSwitch";
import ToggleSwitch from "@components/ui/ToggleSwitch";
import ContainerModal from "@components/modals/ContainerModal";
import GenerateForm from "@components/utils/GenerateForm";

import updateRolePermissions from "@services/roles/updateRolePermissions";
import getRolePermissions from "@services/roles/getRolePermissions";

EditPermissions.propTypes = {
  role: PropTypes.object.isRequired,
  handleEditRolePermissions: PropTypes.func.isRequired,
};

function EditPermissions ({ role, handleEditRolePermissions }) {
  const { handleNotification } = useNotification();
  const [isLoadingOnSaving, setIsLoadingOnSaving] = useState(false);

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

  const formManager = useForm({
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
    <ContainerModal
      title={`Edit Permissions - ${role.name}`}
      isOpen={true}
      onClose={handleEditRolePermissions}
      withOverlay={true}
    >
      <GenerateForm
        fields={[]}
        useForm={formManager}
        onClose={handleEditRolePermissions}
        onSubmit={editRolePermissions}
        submitLabel="Save"
        isLoading={isLoadingOnSaving}
      >
        {rolePermissions && rolePermissions?.map((permission) => (
          <Controller
            key={permission.name}
            name={permission.name}
            control={formManager.control}
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
                    <p className="text-sm font-normal leading-5 dark:text-zinc-500 text-zinc-500">
                      {permission.description}
                    </p>
                  </div>
                )}
              </>
            )}
          />
        ))}
      </GenerateForm>
    </ContainerModal>
  );
}

export default EditPermissions;
