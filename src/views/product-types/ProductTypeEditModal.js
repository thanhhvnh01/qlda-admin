import { getErrorMessage } from '@api/handleApiError';
import {
  createProductTypeAPI,
  getDetailsProductTypeAPI,
  getEnabledCategoriesAPI,
  updateProductTypeAPI,
} from '@api/main';
import CustomDialog from '@components/CustomDialog';
import { FormProvider, RHFTextField } from '@components/hook-forms';
import RHFSelect from '@components/hook-forms/RHFSelect';
import UILoader from '@components/UILoader';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, DialogActions, DialogTitle, Typography, useTheme } from '@mui/material';
import { arrayToSelectOptions } from '@utilities/utils';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import * as yup from 'yup';

const ProductTypeEditModal = ({ open, close, productType }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const intl = useIntl();
  // hooks
  const theme = useTheme();

  const [options, setOptions] = useState([]);

  const productTypeModalSchema = yup.object().shape({
    productTypeNameEn: yup.string().required().max(128).trim(),
    productTypeNameRu: yup.string().required().max(128).trim(),
    categoryId: yup.number().required(),
  });

  const defaultValues = {
    productTypeNameEn: '',
    productTypeNameRu: '',
    categoryId: '',
  };

  const methods = useForm({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(productTypeModalSchema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
  } = methods;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const categoriesRes = await getEnabledCategoriesAPI();
      const options = arrayToSelectOptions(categoriesRes.data, 'categoryName', 'categoryId');
      setOptions(options);
      if (!!productType) {
        const res = await getDetailsProductTypeAPI(productType.productTypeId);
        reset({
          ...defaultValues,
          ...{
            productTypeNameEn: res.data.productTypeNameEn,
            productTypeNameRu: res.data.productTypeNameRu,
            categoryId: res.data.categoryId,
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
  }, [productType, reset]);

  const onSubmit = async (data) => {
    try {
      if (!!productType) {
        await updateProductTypeAPI(productType.productTypeId, {
          productTypeNameEn: data.productTypeNameEn,
          productTypeNameRu: data.productTypeNameRu,
          categoryId: data.categoryId,
        });
      } else {
        await createProductTypeAPI({
          productTypeNameEn: data.productTypeNameEn,
          productTypeNameRu: data.productTypeNameRu,
          categoryId: data.categoryId,
        });
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
        {!!productType
          ? intl.formatMessage({ id: 'label.updateProductType' })
          : intl.formatMessage({ id: 'label.createProductType' })}
      </DialogTitle>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ px: 5 }}>
          <Box sx={{ mb: 2 }}>
            <RHFTextField
              name="productTypeNameEn"
              size="small"
              label={
                <Box sx={{ display: 'flex' }}>
                  <FormattedMessage id="label.nameEn" />
                  <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                </Box>
              }
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <RHFTextField
              name="productTypeNameRu"
              size="small"
              label={
                <Box sx={{ display: 'flex' }}>
                  <FormattedMessage id="label.nameRu" />
                  <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                </Box>
              }
            />
          </Box>
          <Box>
            <RHFSelect
              name="categoryId"
              label={
                <Box sx={{ display: 'flex' }}>
                  <FormattedMessage id="label.category" />
                  <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                </Box>
              }
              getOptionLabel={(option) => <Typography id={option.id}>{option.label}</Typography>}
              options={options}
            />
          </Box>
        </Box>
        <DialogActions sx={{ px: 5, mt: 1, mb: 1 }}>
          <Button variant="contained" type="submit" disabled={!isDirty || !isValid}>
            {!!productType ? intl.formatMessage({ id: 'button.update' }) : intl.formatMessage({ id: 'button.create' })}
          </Button>
          <Button variant="outlined" onClick={close}>
            <FormattedMessage id="button.cancel" />
          </Button>
        </DialogActions>
      </FormProvider>
    </CustomDialog>
  );
};

export default ProductTypeEditModal;
