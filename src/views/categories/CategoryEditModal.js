import { getErrorMessage } from '@api/handleApiError';
import { createCategoryAPI, getDetailsCategoryAPI, updateCategoryAPI } from '@api/main';
import CustomDialog from '@components/CustomDialog';
import { FormProvider, RHFTextField } from '@components/hook-forms';
import UILoader from '@components/UILoader';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, DialogActions, DialogTitle, useTheme } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import * as yup from 'yup';

const CategoryEditModal = ({ open, close, category }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const intl = useIntl();
  const theme = useTheme();

  const categoryModalSchema = yup.object().shape({
    categoryNameEn: yup.string().required().max(128).trim(),
    categoryNameRu: yup.string().required().max(128).trim(),
  });

  const defaultValues = {
    categoryNameEn: '',
    categoryNameRu: '',
  };

  const methods = useForm({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(categoryModalSchema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
  } = methods;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      if (!!category) {
        const res = await getDetailsCategoryAPI(category.categoryId);
        reset({
          ...defaultValues,
          ...{
            categoryNameEn: res.data.categoryNameEn,
            categoryNameRu: res.data.categoryNameRu,
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
  }, [category, reset]);

  const onSubmit = async (data) => {
    try {
      if (!!category) {
        await updateCategoryAPI(category.categoryId, {
          categoryNameEn: data.categoryNameEn,
          categoryNameRu: data.categoryNameRu,
        });
      } else {
        await createCategoryAPI({ categoryNameEn: data.categoryNameEn, categoryNameRu: data.categoryNameRu });
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

  return (
    <CustomDialog fullWidth open={open} onClose={close}>
      <UILoader open={isLoading} />
      <DialogTitle>
        {!!category
          ? intl.formatMessage({ id: 'label.updateCategory' })
          : intl.formatMessage({ id: 'label.createCategory' })}
      </DialogTitle>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ px: 5 }}>
          <Box sx={{ mb: 2 }}>
            <RHFTextField
              name="categoryNameEn"
              size="small"
              label={
                <Box sx={{ display: 'flex' }}>
                  <FormattedMessage id="label.nameEn" />
                  <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                </Box>
              }
            />
          </Box>
          <Box>
            <RHFTextField
              name="categoryNameRu"
              size="small"
              label={
                <Box sx={{ display: 'flex' }}>
                  <FormattedMessage id="label.nameRu" />
                  <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                </Box>
              }
            />
          </Box>
        </Box>
        <DialogActions sx={{ px: 5, mt: 1, mb: 1 }}>
          <Button variant="contained" type="submit" disabled={!isDirty || !isValid}>
            {!!category ? intl.formatMessage({ id: 'button.update' }) : intl.formatMessage({ id: 'button.create' })}
          </Button>
          <Button variant="outlined" onClick={close}>
            <FormattedMessage id="button.cancel" />
          </Button>
        </DialogActions>
      </FormProvider>
    </CustomDialog>
  );
};

export default CategoryEditModal;
