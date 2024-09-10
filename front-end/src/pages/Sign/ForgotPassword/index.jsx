import { useState, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import NotificationContext from "src/context/NotificationContext";

import SignModal from "../SignModal";
import LabeledInput from "@components/ui/LabeledInput";
import Input from "@components/ui/Input";

import forgotPassword from "@services/auth/forgotPassword";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});


function ForgotPassword () {
  const { handleNotification } = useContext(NotificationContext);
  const [ isEmailSending, setIsEmailSending ] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });


  const requestChangePassword = async (data) => {
    setIsEmailSending(true);
    try {
      const response = await forgotPassword(data);

      if (!response.message) {
        throw new Error("Failed to send password reset email.");
      }
      handleNotification({
        model: "success",
        message: "Email sent successfully! Please check your inbox.",
      });
    } catch (error) {
      handleNotification({
        model: "error",
        message: error.message || "An error occurred while sending the email.",
      });
    } finally {
      setIsEmailSending(false);
    }
  };

  return (
    <SignModal isLoading={isEmailSending} handleSubmit={handleSubmit(requestChangePassword)} title="Change password" >
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
                aria-label="Email"
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </LabeledInput>
          )}
        />
        
      </span>
    </SignModal> 

  );
}

export default ForgotPassword;
