// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { Autocomplete, TextField } from "@mui/material";
// components
import FormError from "./FormError";

// ----------------------------------------------------------------------

export default function RHFAutocomplete({ name, label, height, isClearable, options, setIsEdited, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          id={name}
          value={field.value}
          onChange={(event, newValue) => {
            event.preventDefault();
            field.onChange(newValue);
            if (!!setIsEdited) {
              setIsEdited(true);
            }
          }}
          options={options}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              error={!!error}
              helperText={!!error?.message && <FormError>{error.message}</FormError>}
            />
          )}
          disablePortal
          disableClearable={!isClearable}
          ListboxProps={{ style: { maxHeight: height } }}
          {...other}
        />
      )}
    />
  );
}
