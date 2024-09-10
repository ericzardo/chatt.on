import { useRef, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useUser from "@hooks/useUser";

import { Edit3, X } from "react-feather";
import Button from "@components/ui/Button";
import LabeledInput from "@components/ui/LabeledInput";
import Input from "@components/ui/Input";

import updateUserProfile from "@services/users/updateUserProfile";
import useNotification from "@hooks/useNotification";

EditProfile.propTypes = {
  handleEditProfile: PropTypes.func.isRequired,
};

function EditProfile ({ handleEditProfile }) {
  const { handleNotification } = useNotification();
  const { user, revalidateUser } = useUser();

  const fileInputRef = useRef(null);

  const handleEditImageClick = useCallback(() => {
    fileInputRef.current.click();
  }, []);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(z.object({
      username: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(24, "Username must have a maximum of 24 characters"),
      email: z.string().email("Invalid email address"),
    })),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
    },
  });

  const editProfile = async (data) => {

    try {
      const response = await updateUserProfile(data);

      if (!response.user) {
        handleNotification({
          model: "error",
          message: response.error || "An unexpected error occurred.",
        });
        return;
      }

      await revalidateUser();
      handleEditProfile();

    } catch (error) {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred.",
      });
    }   
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 flex items-center justify-center">
        
      <div className="bg-zinc-100 dark:bg-zinc-900 rounded-xl mx-2 md:m-0 p-5 flex flex-col gap-3 min-w-96">

        <span className="flex justify-between gap-6">
          <p 
            className="font-semibold font-alternates text-xl leading-snug text-zinc-900 dark:text-zinc-50"
          >Edit Profile</p>
          <X 
            onClick={handleEditProfile}
            className="w-5 h-5 text-zinc-500 flex items-center justify-center cursor-pointer
          transition-all hover:text-red-700 hover:dark:text-red-500 hover:scale-110"
            aria-label="Toggle edit profile"
          />
        </span>

        <form onSubmit={handleSubmit(editProfile)} className="flex justify-between gap-10">
          <span className="flex gap-3">
            <div className="w-28 h-28 relative rounded-full border-2 bg-black border-blue-900">
              <div
                className="flex items-center justify-center p-2 absolute w-8 h-8 bg-zinc-100 dark:bg-zinc-900 border-blue-500 border right-2 bottom-0 rounded-full transition-transform cursor-pointer hover:scale-105"
                onClick={handleEditImageClick}
                aria-label="Change profile picture"
              >
                <Edit3 className="dark:text-zinc-400 text-zinc-600" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
              />
            </div>

          </span>

          <span className="flex flex-col gap-3">

            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <LabeledInput name="username" labelText="Username">
                  <Input
                    {...field}
                    type="text"
                    size="sm"
                    aria-label="Change username"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">{errors.username.message}</p>
                  )}
                </LabeledInput>
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <LabeledInput name="email" labelText="Email">
                  <Input
                    {...field}
                    type="email"
                    size="sm"
                    aria-label="Change email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                </LabeledInput>
              )}
            />

            <span className="flex gap-4 items-center justify-end">
              <Button
                onClick={handleEditProfile}
                type="button"
                size="sm"
                color="transparent"
                aria-label="Cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                aria-label="Save"
              >
                Save
              </Button>
            </span>

          </span>

        </form>
  
      </div>

    </div>
  );
}

export default EditProfile;