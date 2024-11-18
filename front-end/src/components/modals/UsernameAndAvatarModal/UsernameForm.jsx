/* eslint-disable camelcase */
import { useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PropTypes from "prop-types";

import useUser from "@hooks/useUser";
import useNotification from "@hooks/useNotification";

import { ArrowRight } from "react-feather";
import Button from "@components/ui/Button";

import createUserWithChat from "@services/users/createUserWithChat";

UsernameAndAvatarModalUsernameForm.propTypes = {
  chat: PropTypes.object.isRequired,
  selectedAvatar: PropTypes.number.isRequired,
};

const schema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(24, "Username must have a maximum of 24 characters"),
});

function UsernameAndAvatarModalUsernameForm ({ chat, selectedAvatar }) {
  const { revalidateUser } = useUser();
  const { handleNotification } = useNotification();
  
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
    },
  });

  const connectUserToChat = async (data) => {
    try {
      const response = await createUserWithChat({ ...data, selectedAvatar }, chat);

      if (!response.accessToken) {
        handleNotification({
          model: "error",
          message: response.error || "An unexpected error occurred.",
        });
        return;
      }
      localStorage.setItem("token", response.accessToken);
      await revalidateUser();
      navigate(`/c/${chat.name}`);
      
    } catch (error) {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred."
      });
    }
  };

  return (
    <form autoComplete="off" onSubmit={handleSubmit(connectUserToChat)} className="flex flex-col gap-5 justify-center">
      <p className="font-medium font-alternates leading-snug text-lg text-left text-zinc-700 dark:text-zinc-300">Write your nickname to continue to the chat</p>

      <Controller
        name="username"
        control={control}
        render={({ field }) => (
          <span className="flex flex-col gap-1">
            <input
              {...field}
              name="username"
              className="outline-none border-none font-semibold bg-zinc-300 text-zinc-600 placeholder:text-zinc-400 dark:bg-zinc-800 dark:placeholder-zinc-700 dark:text-zinc-500 p-3 rounded-lg"
              type="text"
              placeholder="Example: CoolUsername321" 
              aria-label="Username input field"
              aria-required="true"
            />
            <p className="leading-snug font-alternates text-[10px] text-center text-zinc-700 dark:text-zinc-500">
              Your nickname must be between 3-24 characters.
            </p>
          </span>
        )}
      />

      {errors.username && (
        <p className="text-red-500 text-xs">{errors.username.message}</p>
      )}

      <p
        className="font-alternates leading-snug text-zinc-500 dark:text-zinc-400"
      >
        Have an account? 
        <Link 
          to="/sign-in"
          className="dark:text-white text-zinc-800"
          aria-label="Sign in"
        >
          sign in
        </Link>
      </p>
      <Button
        type="submit"
        size="icon"
        aria-label="Continue"
      >
        Continue
        <ArrowRight />
      </Button>
    </form>
  );
}

export default UsernameAndAvatarModalUsernameForm;