import { getErrorMessage } from '@api/handleApiError';
import { createColorAPI, getDetailsColorAPI, updateColorAPI } from '@api/main';
import CustomDialog from '@components/CustomDialog';
import { FormProvider, RHFTextField } from '@components/hook-forms';
import UILoader from '@components/UILoader';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, DialogActions, DialogTitle, Grid, Stack, Typography, useTheme } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import * as yup from 'yup';

const ColorEditModal = ({ open, close, color }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const intl = useIntl();
  const theme = useTheme();

  const colorModalSchema = yup.object().shape({
    colorNameEn: yup.string().required().max(128).trim(),
    colorNameRu: yup.string().required().max(128).trim(),
    colorCodes: yup.array().required().min(0),
  });

  const defaultValues = {
    colorNameEn: '',
    colorNameRu: '',
    colorCodes: [],
  };

  const methods = useForm({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(colorModalSchema),
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { isValid, isDirty },
  } = methods;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      if (!!color) {
        const res = await getDetailsColorAPI(color.colorId);
        reset({
          ...defaultValues,
          ...{
            colorNameEn: res.data.colorNameEn,
            colorNameRu: res.data.colorNameRu,
            colorCodes: res.data.colorCodes,
          },
        });
      }
    } catch (error) {
      enqueueSnackbar(<FormattedMessage id={getErrorMessage(error)} defaultMessage={getErrorMessage(error)} />, {
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color, reset]);

  const onSubmit = async (data) => {
    const colorArray = data.colorCodes.map((i) => {
      return i;
    });
    const formData = {
      colorNameEn: data.colorNameEn,
      colorNameRu: data.colorNameRu,
      colorCodes: colorArray,
    };

    try {
      if (!!color) {
        await updateColorAPI(color.colorId, formData);
      } else {
        await createColorAPI(formData);
      }
      close('SAVED');
      enqueueSnackbar('Thành công !', {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar(<FormattedMessage id={getErrorMessage(error)} defaultMessage={getErrorMessage(error)} />, {
        variant: 'error',
      });
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'colorCodes',
  });

  return (
    <CustomDialog fullWidth open={open} onClose={close} maxWidth="sm">
      <UILoader open={isLoading} />
      <DialogTitle>
        {!!color ? intl.formatMessage({ id: 'label.updateColor' }) : intl.formatMessage({ id: 'label.createColor' })}
      </DialogTitle>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3} p="24px">
          <Grid item md={6}>
            <RHFTextField
              name="colorNameEn"
              size="small"
              label={
                <Box sx={{ display: 'flex' }}>
                  <FormattedMessage id="label.nameEn" />
                  <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                </Box>
              }
            />
          </Grid>
          <Grid item md={6}>
            <RHFTextField
              name="colorNameRu"
              size="small"
              label={
                <Box sx={{ display: 'flex' }}>
                  <FormattedMessage id="label.nameRu" />
                  <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                </Box>
              }
            />
          </Grid>
        </Grid>
        <Box px={3}>
          <Box>
            <Button
              onClick={() => {
                append('#000000');
              }}
              variant="text"
              endIcon={<AddIcon />}
              // sx={{ m: '0 0 0 30px' }}
            >
              <Typography fontWeight="bold" textTransform="none">
                Thêm mã màu
              </Typography>
            </Button>
          </Box>
          <Stack mt={2} spacing={2} sx={{ width: '60%' }}>
            {fields.map((item, index) => {
              return (
                <Box key={item.id} display="flex">
                  <RHFTextField label={`Mã màu ${index + 1}`} size="small" name={`colorCodes.${index}`} />
                  <CloseIcon
                    sx={{ mt: 1, ml: 1, cursor: 'pointer' }}
                    onClick={() => {
                      remove(index);
                    }}
                    color="error"
                  />
                </Box>
              );
            })}
          </Stack>
        </Box>
        <DialogActions>
          <Button variant="contained" type="submit" disabled={!isDirty || !isValid}>
            {!!color ? intl.formatMessage({ id: 'button.update' }) : intl.formatMessage({ id: 'button.create' })}
          </Button>
          <Button variant="outlined" onClick={close}>
            <FormattedMessage id="button.cancel" />
          </Button>
        </DialogActions>
      </FormProvider>
    </CustomDialog>
  );
};

export default ColorEditModal;
