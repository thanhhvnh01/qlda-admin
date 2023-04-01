// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { MenuItem, TextField } from '@mui/material';
// components
import FormError from './FormError';
import { FormattedMessage } from 'react-intl';

// ----------------------------------------------------------------------

export default function RHFSelect({ name, options, native, disabledOption, getOptionLabel, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <TextField
            {...field}
            id={name}
            select
            fullWidth
            // SelectProps={{ native: !!native }}
            error={!!error}
            helperText={!!error?.message && <FormError>{error.message}</FormError>}
            {...other}
          >
            {options?.length > 0 ? (
              options.map((option, index) => (
                <MenuItem key={index} value={option.id} disabled={!!disabledOption ? disabledOption(option) : false}>
                  {!getOptionLabel ? option.label : getOptionLabel(option)}
                </MenuItem>
              ))
            ) : (
              <MenuItem>
                <FormattedMessage id="label.noOptions" defaultMessage="No Options" />
              </MenuItem>
            )}
          </TextField>
        </>
      )}
    />
  );
}
