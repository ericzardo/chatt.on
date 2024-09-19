import { useRef, useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useUser from "@hooks/useUser";
import useNotification from "@hooks/useNotification";

import { Edit3, X } from "react-feather";
import Button from "@components/ui/Button";
import LabeledInput from "@components/ui/LabeledInput";
import Input from "@components/ui/Input";
import withClickOutside from "@components/hoc/withClickOutside";

import updateUserProfile from "@services/users/updateUserProfile";
import getPresignedUrl from "@services/images/getPresignedUrl";
import uploadImage from "@services/images/uploadImage";

EditProfile.propTypes = {
  handleEditProfile: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
};

function EditProfile ({ handleEditProfile, isMobile }) {
  const { handleNotification } = useNotification();
  const { user, revalidateUser } = useUser();

  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(user?.profile_picture_url || "");
  const [selectedFile, setSelectedFile] = useState(null);

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

  const handleEditImageClick = useCallback(() => {
    fileInputRef.current.click();
  }, []);

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setSelectedFile(file);
    }
  }, []);

  const handleImageUpload = async (file) => {
    try {
      const { name: fileName, type: fileType, size: fileSize } = file;
      const data = { fileName, fileType, fileSize };

      const { signedUrl: presignedUrl, imageUrl } = await getPresignedUrl(data);

      await uploadImage(presignedUrl, file);

      return imageUrl;
    } catch (error) {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred.",
      });
    }
  };

  const editProfile = async (data) => {

    try {
      let imageUrl = imagePreview;

      if (selectedFile) {
        imageUrl = await handleImageUpload(selectedFile);
      }

      const response = await updateUserProfile({
        ...data,
        // eslint-disable-next-line camelcase
        profile_picture_url: imageUrl
      });

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

        
    <div className="bg-zinc-100 dark:bg-zinc-900 rounded-xl mx-2 md:m-0 p-5 flex flex-col gap-3">

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

      <form onSubmit={handleSubmit(editProfile)} className={`${isMobile ? "flex-col items-center" : "flex justify-between"} gap-10`}>
        <span className={`flex gap-3 ${isMobile ? "justify-center mt-2 mb-2" : ""}`}>
          <div className="w-28 h-28 relative rounded-full border-2 bg-black border-blue-900">
            <img
              src={imagePreview}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
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
              onChange={handleFileChange}
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
  );
}

const EditProfileWithHandled = withClickOutside(EditProfile);

export default EditProfileWithHandled;