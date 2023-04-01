// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';
import FormError from './FormError';

// ----------------------------------------------------------------------

export default function RHFTextField({ name, conditionValidate = true, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          error={!!error && conditionValidate}
          helperText={!!error?.message && conditionValidate && <FormError>{error.message}</FormError>}
          {...other}
        />
      )}
    />
  );
}
