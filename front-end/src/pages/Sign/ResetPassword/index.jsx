import { useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import NotificationContext from "src/context/NotificationContext";

import SignModal from "../SignModal";
import LabeledInput from "@components/ui/LabeledInput";
import Input from "@components/ui/Input";

import resetPassword from "@services/auth/resetPassword";

const schema = z.object({
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
});


function ResetPassword () {
  const { handleNotification } = useContext(NotificationContext);
  const [ isPasswordChanging, setIsPasswordChanging ] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    },
  });

  const changePassword = async (data) => {
    setIsPasswordChanging(true);
    const pathname = location.pathname.split("/");
    const token = pathname[pathname.length - 1];

    try {
      const response = await resetPassword(token, data);

      if (!response.message) {
        throw new Error("Failed to change your password");
      }

      handleNotification({
        model: "success",
        message: "Your password has been successfully reset. You can now log in with your new password.",
      });
      navigate("/sign-in");
    } catch (error) {
      handleNotification({
        model: "error",
        message: error.message || "An error occurred while changing your password.",
      });
    } finally {
      setIsPasswordChanging(false);
    }
  };

  return (

    <SignModal isLoading={isPasswordChanging} handleSubmit={handleSubmit(changePassword)} title="Change password" >
      <span className="flex flex-col gap-5">

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <LabeledInput name="password" labelText="Password">
              <Input
                {...field}
                type="password"
                placeholder="New password!"
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
                placeholder="Confirm your pass!"
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

export default ResetPassword;
