import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import useNotification from "@hooks/useNotification";

import queryClient from "@lib/queryClient";

import LabeledInput from "@components/ui/LabeledInput";
import Button from "@components/ui/Button";
import RoleCard from "@components/RoleCard";

import ContainerModal from "@components/modals/ContainerModal";
import GenerateForm from "@components/utils/GenerateForm";

import getRoles from "@services/getRoles";
import updateUserRoles from "@services/users/updateUserRoles";

EditRolesModal.propTypes = {
  user: PropTypes.object.isRequired,
  handleEditRolesModal: PropTypes.func.isRequired,
};

function EditRolesModal ({ user, handleEditRolesModal }) {
  const { handleNotification } = useNotification();
  const [ isRolesDropdownOpen, setIsRolesDropdownOpen ] = useState(false);
  const roleColorMap = { admin: "blue", user: "red", };

  const handleRolesDropdownOpen = useCallback(() => {
    setIsRolesDropdownOpen(prev => !prev);
  }, []);

  const formManager = useForm({
    // resolver: zodResolver(z.object({
    //   roles: z.array(),
    // })),
    defaultValues: {
      roles: [...user?.roles || null],
    },

  });

  const { data: allRoles } = useQuery({
    queryKey: ["get-roles"],
    queryFn: getRoles,
    onError: (error) => {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred."
      });
    }
  });

  const saveUserRolesMutation = useMutation({
    mutationFn: (data) => updateUserRoles(data),
    onSuccess: () => {
      handleNotification({
        model: "success",
        message: "Updated user roles.",
      });

      queryClient.invalidateQueries(["get-users"]);
      handleEditRolesModal();
    },
    onError: (error) => {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred.",
      });
    },
  });

  const saveUserRoles = (data) => {
    const { roles } = data;

    const userRolesData = {
      roles,
      user
    };

    saveUserRolesMutation.mutate(userRolesData);
  }; 

  const addRole = useCallback((role) => {
    const { setValue, watch } = formManager;

    const currentRoles = watch("roles");
    if (currentRoles.some((r) => r.name === role.name)) return;
  
    setValue("roles", [...currentRoles, role]);
    handleRolesDropdownOpen();
  }, [formManager, handleRolesDropdownOpen]);

  const removeRole = useCallback((role) => {
    if (role.name.toLowerCase() === "user") return;

    const { setValue, watch } = formManager;

    const currentRoles = watch("roles");
    setValue("roles", currentRoles.filter((r) => r.name !== role.name));
  }, [formManager]);

  const availableRoles = allRoles?.filter(role => 
    !formManager.watch("roles").some(userRole => {
      return userRole.name === role.name;
    })
  ) || [];

  return (
    <ContainerModal title="Edit Roles">
      <GenerateForm
        fields={[]}
        useForm={formManager}
        onClose={handleEditRolesModal}
        onSubmit={saveUserRoles}
        submitLabel="Save"
      >
        <LabeledInput name="roles" labelText="Roles">
          <span className="relative py-2 h-12 w-full flex items-center flex-wrap gap-2 font-semibold rounded-lg roles">
            {formManager.watch("roles") && formManager.watch("roles").length > 0 && formManager.watch("roles").map((role) => (
              <RoleCard
                key={role.name}
                name={role.name}
                removeRole={() => removeRole(role)}
              />
            ))}
            {formManager.watch("roles").length < allRoles?.length && (
              <Button
                onClick={handleRolesDropdownOpen}
                size="square"
                color="transparent"
              >
                +
              </Button>
            )}

            {isRolesDropdownOpen && (
              <ul className="absolute top-full flex flex-col gap-2 w-fit py-4 px-5 rounded-lg bg-zinc-300 dark:bg-zinc-800">
                {availableRoles.map(role => (
                  <li
                    key={role.name}
                    onClick={() => addRole(role)}
                    className="cursor-pointer"
                  >
                    <span className="flex gap-2 items-center">
                      <span
                        className={`w-3 h-3 bg-${roleColorMap[role.name]}-500 rounded-full`}
                      ></span>
                      <p className="capitalize font-alternates font-semibold text-base text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 hover:dark:text-zinc-200">
                        {role.name}
                      </p>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </span>
        </LabeledInput>
      </GenerateForm>
    </ContainerModal>
  );
}

export default EditRolesModal;