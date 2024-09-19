import { Controller } from "react-hook-form";
import PropTypes from "prop-types";

import { Loader } from "react-feather";
import LabeledInput from "@components/ui/LabeledInput";
import Input from "@components/ui/Input";
import Button from "@components/ui/Button";
import SelectInput from "@components/ui/SelectInput";

GenerateForm.propTypes = {
  isLoading: PropTypes.bool,
  submitLabel: PropTypes.string,

  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
      placeholder: PropTypes.string,
    })
  ),
  useForm: PropTypes.object.isRequired,

  children: PropTypes.node,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
};


function GenerateForm ({ onSubmit, onClose, fields, isLoading = false, submitLabel = "Create", children, useForm }) {
  if (!useForm) return;

  const { control, handleSubmit, formState: { errors } } = useForm; 

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      {fields && fields.length > 0 &&
       fields?.map(({ name, label, type, placeholder, options  }) => (
         <Controller
           key={name}
           name={name}
           control={control}
           render={({ field }) => (
             <LabeledInput name={name} labelText={label}>
               {type === "color" ? (
                 <Input
                   type="color"
                   size="sm"
                   {...field}
                 />
               ) : type === "select" ? (
                 <SelectInput
                   {...field}
                   options={options}
                   placeholder={placeholder}
                 />
               ) : (
                 <Input type={type} placeholder={placeholder} {...field} />
               )}
               {errors[name] && <p className="text-red-500 text-sm">{errors[name]?.message}</p>}
             </LabeledInput>
           )}
         />
       )) || []}

      {children ? children : null}

      <div className="flex justify-end items-center gap-2">
        <Button disabled={isLoading} size="sm" type="submit">
          {!isLoading ? (
            <>
              {submitLabel}
            </>
          ) : (
            <Loader className="animate-spin text-zinc-400" />    
          )}
        </Button>
        <Button size="sm" color="transparent" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default GenerateForm;
