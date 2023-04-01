import Cleave from "cleave.js/react";
// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { TextField } from "@mui/material";
import FormError from "./FormError";
import React from "react";

// ----------------------------------------------------------------------
const defaultOptions = {
  numeral: true,
  numeralDecimalScale: 2,
  numeralDecimalMark: ".",
  delimiter: ",",
};

const CleaveTextField = React.forwardRef(({ options, ...otherProps }, inputRef) => (
  <Cleave {...otherProps} htmlRef={inputRef} options={{ ...defaultOptions, ...options }} />
));

export default function RHFNumberInput({ name, options, trigger, InputProps, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <TextField
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (!!trigger) {
              trigger();
            }
          }}
          fullWidth
          error={!!error}
          helperText={!!error?.message && <FormError>{error.message}</FormError>}
          InputProps={{
            inputComponent: CleaveTextField,
            inputProps: { options },
            ...InputProps,
          }}
          {...other}
        />
      )}
    />
  );
}
