import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useUser from "@hooks/useUser";
import useNotification from "@hooks/useNotification";


import LabeledInput from "@components/ui/LabeledInput";
import Input from "@components/ui/Input";
import SignModal from "../SignModal";

import authLogin from "@services/auth/authLogin";

const schema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long."),
});


function SignIn () {
  const navigate = useNavigate();

  const { revalidateUser } = useUser();
  const { handleNotification } = useNotification();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const footerDetailsModal = {
    text: "Wait! An account?",
    strong: "sign up",
    link: "/sign-up"
  };

  const connectUser = async (data) => {
    try {
      const response = await authLogin(data);

      if (!response.accessToken) {
        handleNotification({
          model: "error",
          message: response.error || "An unexpected error occurred.",
        });
        return;
      }
      revalidateUser();
      navigate("/");

    } catch (error) {
      handleNotification({
        model: "error",
        message: error.message || "An unexpected error occurred.",
      });
    }

  };

  return (

    <SignModal handleSubmit={handleSubmit(connectUser)} title="Meet new people!" footerDetailsModal={footerDetailsModal} >
      <span className="flex flex-col gap-5">

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <LabeledInput name="email" labelText="Email">
              <Input
                {...field}
                type="text"
                placeholder="Example: josesilva@gmail.com"
                aria-invalid={errors.email ? "true" : "false"}
                aria-label="Email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </LabeledInput>
          )}
        />

        <span className="flex flex-col gap-1">
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <LabeledInput name="password" labelText="Password">
                <Input
                  {...field}
                  type="password"
                  placeholder="Type here"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-label="Password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </LabeledInput>
            )}
          />
          <p onClick={() => navigate("/forgot-password")} className="text-xs dark:text-zinc-400 text-zinc-500 cursor-pointer font-medium">Forgot my password</p>
        </span> 
        
        
      </span>
    </SignModal> 

  );
}

export default SignIn;
