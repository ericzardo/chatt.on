import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PropTypes from "prop-types";

import queryClient from "@lib/queryClient";
import useNotification from "@hooks/useNotification";

import Input from "@components/ui/Input";
import withClickOutside from "@components/hoc/withClickOutside";

import ContainerModal from "@components/modals/ContainerModal";
import GenerateForm from "@components/utils/GenerateForm";

import updateRole from "@services/roles/updateRole";

EditRoleModal.propTypes = {
  role: PropTypes.object.isRequired,
  handleEditRole: PropTypes.func.isRequired,
};

function EditRoleModal ({ role, handleEditRole }) {
  const { handleNotification } = useNotification();
  const [isLoadingOnSaving, setIsLoadingOnSaving] = useState(false);

  const formManager = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().min(4, "Role name must be at least 3 characters long"),
        color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      })
    ),
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

  const editRole = useCallback(
    (data) => {
      setIsLoadingOnSaving(true);
      editRoleMutation.mutate({ role, data });
    },
    [editRoleMutation, role]
  );

  return (
    <ContainerModal
      title={`Edit Role - ${role.name}`}
      isOpen={true}
      onClose={handleEditRole}
      withOverlay={true}
    >
      <GenerateForm
        fields={[
          {
            name: "name",
            label: "Role Name",
            type: "text",
            render: ({ field, fieldState: { error } }) => (
              <>
                <Input {...field} size="sm" aria-label="Change role name" />
                {error && <p className="text-red-500 text-sm">{error.message}</p>}
              </>
            ),
          },
          {
            name: "color",
            label: "Role Color",
            type: "color",
            render: ({ field, fieldState: { error } }) => (
              <>
                <Input {...field} size="sm" aria-label="Change role color" />
                {error && <p className="text-red-500 text-sm">{error.message}</p>}
              </>
            ),
          },
        ]}
        useForm={formManager}
        onClose={handleEditRole}
        onSubmit={editRole}
        submitLabel="Save"
        isLoading={isLoadingOnSaving}
      />
    </ContainerModal>
  );
}

const EditRoleModalWithHandled = withClickOutside(EditRoleModal);

export default EditRoleModalWithHandled;
