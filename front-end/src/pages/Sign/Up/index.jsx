import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useNotification from "@hooks/useNotification";

import LabeledInput from "@components/ui/LabeledInput";
import SignModal from "../SignModal";
import Input from "@components/ui/Input";

import createUser from "@services/users/createUser";

function SignUp () {
  const { handleNotification } = useNotification();
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(z.object({
      username: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(24, "Username must have a maximum of 24 characters"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(6, "Password must be at least 6 characters long"),
      confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters long"),
    }).superRefine(({ password, confirmPassword }, ctx) => {
      if (password !== confirmPassword) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "Passwords do not match",
        });
      }
    })),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const footerDetailsModal = {
    text: "Have an account?",
    strong: "sign in",
    link: "/sign-in"
  };

  const createNewUser = async (data) => {
    try {
      const response = await createUser(data);

      if (!response.user) {
        handleNotification({
          model: "error",
          message: response.error || "An unexpected error occurred.",
        });
        return;
      }

      handleNotification({
        model: "success",
        message: "Account created successfully. Now you can login",
      });

      navigate("/sign-in");
    } catch (error) {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred.",
      });
    }   
  };


  return (

    <SignModal handleSubmit={handleSubmit(createNewUser)} title="Meet new people!" footerDetailsModal={footerDetailsModal} >
      <span className="flex flex-col gap-5">

        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <LabeledInput name="username" labelText="Username">
              <span className="flex flex-col gap-1">
                <Input
                  {...field}
                  type="text"
                  placeholder="Example: CoolUsername321"
                  aria-label="Username"
                  aria-invalid={errors.username ? "true" : "false"}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username.message}</p>
                )}
                <p className="leading-snug font-alternates text-[10px] text-left text-zinc-700 dark:text-zinc-500">Obs: This username is displayed to others</p>
              </span>
              
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
                type="text"
                placeholder="Example: josesilva@gmail.com"
                aria-label="Email"
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </LabeledInput>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <LabeledInput name="password" labelText="Password">
              <Input
                {...field}
                type="password"
                placeholder="Type here"
                aria-label="Password"
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </LabeledInput>
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <LabeledInput name="confirmPassword" labelText="Confirm Password">
              <Input
                {...field}
                type="password"
                placeholder="Your pass here!"
                aria-label="Confirm password"
                aria-invalid={errors.confirmPassword ? "true" : "false"}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
              )}
            </LabeledInput>
          )}
        />
    
      </span>
    </SignModal> 
  );
}

export default SignUp;
