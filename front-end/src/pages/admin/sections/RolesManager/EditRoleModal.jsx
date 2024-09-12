import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PropTypes from "prop-types";

import queryClient from "@lib/queryClient";
import useNotification from "@hooks/useNotification";

import { Loader } from "react-feather";
import LabeledInput from "@components/ui/LabeledInput";
import Input from "@components/ui/Input";
import Button from "@components/ui/Button";

import updateRole from "@services/roles/updateRole";

EditRoleModal.propTypes = {
  role: PropTypes.object.isRequired,
  handleEditRole: PropTypes.func.isRequired,
};

function EditRoleModal ({ role, handleEditRole }) {
  const { handleNotification } = useNotification();
  const [ isLoadingOnSaving, setIsLoadingOnSaving ] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(z.object({
      name: z
        .string()
        .min(4, "Role name must be at least 3 characters long"),
      color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    })),
    defaultValues: {
      name: role?.name || "",
      color: role?.color || "",
    },
  });

  const editRoleMutation = useMutation({
    mutationFn: ({ role, data }) => updateRole(role, data),
    onSuccess: () => {
      setIsLoadingOnSaving(false);

      handleNotification({
        model: "success",
        message: "Role updated successfully.",
      });

      queryClient.invalidateQueries(["get-roles"]);
      handleEditRole();
    },
    onError: (error) => {
      setIsLoadingOnSaving(false);

      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred.",
      });
    },
  });

  const editRole = useCallback((data) => {
    setIsLoadingOnSaving(true);
    editRoleMutation.mutate({ role, data});
  }, [editRoleMutation, role]);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center mx-2 md:m-0 bg-zinc-950/80">
      <div className="bg-zinc-100 dark:bg-zinc-900 rounded-xl p-5 flex flex-col gap-6 w-[460px] shadow-2xl">
        <p className="font-semibold font-alternates text-xl leading-snug text-zinc-900 dark:text-zinc-50">
          {`Edit Role - ${role.name}`}
        </p>
        <form onSubmit={handleSubmit(editRole)} className="flex flex-col gap-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <LabeledInput name="name" labelText="Role Name">
                <Input
                  {...field}
                  type="text"
                  size="sm"
                  aria-label="Change role name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </LabeledInput>
            )}
          />
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <LabeledInput name="color" labelText="Role Color">
                <Input
                  {...field}
                  type="color"
                  size="sm"
                  aria-label="Change role color"
                />
                {errors.color && (
                  <p className="text-red-500 text-sm">{errors.color.message}</p>
                )}
              </LabeledInput>
            )}
          />

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
            <Button size="sm" color="transparent" onClick={handleEditRole}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRoleModal;