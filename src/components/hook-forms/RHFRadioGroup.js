// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { Radio, RadioGroup, FormHelperText, FormControlLabel } from "@mui/material";
import FormError from "./FormError";

// ----------------------------------------------------------------------

export default function RHFRadioGroup({ name, options, getOptionLabel, isBoolean, isClearable, sx, ...other }) {
  const { control } = useFormContext();

  const handleClick = (event, value, onChange) => {
    if (event.target.value === value) {
      onChange("");
    } else {
      onChange(event.target.value);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <>
          <RadioGroup
            sx={{ m: "0px !important", ...sx }}
            onChange={(e) => onChange(!!isBoolean ? e.target.value === "true" : e.target.value)}
            row
            value={String(value)}
            {...other}
          >
            {options.map((option, index) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                disabled={!!option.isReadOnly}
                control={
                  <Radio
                    onClick={(e) => {
                      if (!!isClearable) {
                        handleClick(e, value, onChange);
                      }
                    }}
                  />
                }
                label={!!getOptionLabel ? getOptionLabel[index] : option.label}
              />
            ))}
          </RadioGroup>

          {!!error && (
            <FormHelperText error sx={{ px: 2 }}>
              <FormError>{error.message}</FormError>
            </FormHelperText>
          )}
        </>
      )}
    />
  );
}
