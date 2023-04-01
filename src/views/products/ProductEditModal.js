import { getErrorMessage } from '@api/handleApiError';
import {
  createProductAPI,
  getDetailsProductAPI,
  getEnabledCategoriesAPI,
  getEnabledColorsAPI,
  getEnabledProductTypesAPI,
  updateProductAPI,
} from '@api/main';
import CustomDialog from '@components/CustomDialog';
import { FormProvider, RHFTextField } from '@components/hook-forms';
import { RHFCheckbox } from '@components/hook-forms/RHFCheckbox';
import RHFSelect from '@components/hook-forms/RHFSelect';
import MultiImageUpload from '@components/multiImageUpload';
import UILoader from '@components/UILoader';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, DialogActions, DialogContent, DialogTitle, Grid, Stack, useTheme } from '@mui/material';
import {
  HairStyleDisplayConfig,
  HairStyleEnum,
  LengthMeasureUnitDisplayConfig,
  LengthMeasureUnitEnum,
  MaterialTypeEnum,
  PackingRuleEnum,
  WeightMeasureUnitEnum,
} from '@utilities/constants';
import { arrayToSelectOptions, enumToSelectOptions } from '@utilities/utils';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import * as yup from 'yup';

const ProductEditModal = ({ open, close, product }) => {
  // hooks
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();
  const [categoryData, setCategoryData] = useState([]);
  const [productTypeData, setProductTypeData] = useState([]);
  const [colorData, setColorData] = useState([]);
  const [toggle, setToggle] = useState(false);

  const defaultValues = {
    productGroupNameEn: '',
    productGroupNameRu: '',
    categoryId: '',
    productTypeId: '',
    materialTypeId: '',
    hairStyleId: '',
    measureUnitLengthId: '',
    fromLength: '',
    toLength: '',
    measureUnitWeightId: '',
    weight: '',
    origin: '',
    packingRuleId: '',
    videoUrl: '',
    descriptionEn: '',
    descriptionRu: '',
    colors: [
      {
        isBestSelling: false,
        colorId: '',
        images: [
          {
            imageId: null,
            isMainImage: null,
          },
        ],
        isEnabled: true,
      },
    ],
  };

  const FormSchema = yup.object().shape({
    productGroupNameEn: yup.string().required(),
    productGroupNameRu: yup.string().required(),
    productTypeId: yup.number().required(),
    materialTypeId: yup.number().required(),
    hairStyleId: yup.number().required(),
    measureUnitLengthId: yup.number().required(),
    fromLength: yup.number().required(),
    toLength: yup.number().required(),
    measureUnitWeightId: yup.number().required(),
    weight: yup.number().required(),
    origin: yup.string().required(),
    packingRuleId: yup.number(),
    videoUrl: yup.string().required(),
    descriptionEn: yup.string(),
    descriptionRu: yup.string(),
  });

  const methods = useForm({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(FormSchema),
  });

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { isDirty, isValid },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'colors',
  });

  const addColor = () => {
    append({
      isBestSelling: false,
      colorId: null,
      images: [],
      isEnabled: true,
    });
  };

  const removeColor = (index) => {
    remove(index);
  };

  const categoryId = watch('categoryId');

  // data
  const fetchCategoryData = async () => {
    try {
      const res = await getEnabledCategoriesAPI();
      setCategoryData(res.data);
    } catch (error) {
      enqueueSnackbar(<FormattedMessage id={getErrorMessage(error)} defaultMessage={getErrorMessage(error)} />, {
        variant: 'error',
      });
    }
  };

  const fetchProductTypeData = async (categoryId) => {
    try {
      const res = await getEnabledProductTypesAPI(categoryId);
      setProductTypeData(res.data);
    } catch (error) {
      enqueueSnackbar(<FormattedMessage id={getErrorMessage(error)} defaultMessage={getErrorMessage(error)} />, {
        variant: 'error',
      });
    }
  };

  const fetchColorData = async () => {
    try {
      const res = await getEnabledColorsAPI();
      setColorData(res.data);
    } catch (error) {
      enqueueSnackbar(<FormattedMessage id={getErrorMessage(error)} defaultMessage={getErrorMessage(error)} />, {
        variant: 'error',
      });
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      if (!!product) {
        const res = await getDetailsProductAPI(product.productGroupId);
        setData(res.data);
        reset({
          ...defaultValues,
          ...{
            productGroupNameEn: res.data.productNameEn,
            productGroupNameRu: res.data.productNameRu,
            categoryId: res.data.categoryId,
            productTypeId: res.data.productTypeId,
            materialTypeId: res.data.materialTypeId,
            hairStyleId: res.data.hairStyleId,
            measureUnitLengthId: res.data.measureUnitLengthId,
            fromLength: res.data.fromLength,
            toLength: res.data.toLength,
            measureUnitWeightId: res.data.measureUnitWeightId,
            weight: res.data.weight,
            origin: res.data.origin,
            packingRuleId: res.data.packingRuleId,
            videoUrl: res.data.videoUrl,
            descriptionEn: res.data.descriptionEn,
            descriptionRu: res.data.descriptionRu,
            colors: res.data.colors,
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
    fetchCategoryData();
    fetchColorData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!!categoryId) {
      fetchProductTypeData(categoryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = {
      productGroupNameEn: data.productGroupNameEn,
      productGroupNameRu: data.productGroupNameRu,
      productTypeId: data.productTypeId,
      materialTypeId: data.materialTypeId,
      hairStyleId: data.hairStyleId,
      measureUnitLengthId: data.measureUnitLengthId,
      fromLength: data.fromLength,
      toLength: data.toLength,
      measureUnitWeightId: data.measureUnitWeightId,
      weight: data.weight,
      origin: data.origin,
      packingRuleId: data.packingRuleId,
      videoUrl: data.videoUrl,
      descriptionEn: data.descriptionEn,
      descriptionRu: data.descriptionRu,
      colors: data.colors,
    };
    try {
      if (!!product) {
        await updateProductAPI(product.productGroupId, formData);
      } else {
        await createProductAPI(formData);
      }
      close('SAVED');
      enqueueSnackbar('Thành công !', {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar(<FormattedMessage id={getErrorMessage(error)} defaultMessage={getErrorMessage(error)} />, {
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomDialog fullWidth open={open} onClose={close} maxWidth="lg">
      <UILoader open={isLoading} />
      <DialogTitle>
        {!!product ? <FormattedMessage id="label.updateProduct" /> : <FormattedMessage id="label.createProduct" />}
      </DialogTitle>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box>
            <Grid container spacing={2.5}>
              <Grid item md={6}>
                <RHFTextField
                  name="productGroupNameEn"
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
                  name="productGroupNameRu"
                  size="small"
                  label={
                    <Box sx={{ display: 'flex' }}>
                      <FormattedMessage id="label.nameRu" />
                      <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                    </Box>
                  }
                />
              </Grid>
              <Grid item md={6}>
                <RHFSelect
                  name="categoryId"
                  size="small"
                  label={
                    <Box sx={{ display: 'flex' }}>
                      <FormattedMessage id="label.category" />
                      <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                    </Box>
                  }
                  options={arrayToSelectOptions(categoryData, 'categoryName', 'categoryId')}
                />
              </Grid>
              <Grid item md={6}>
                <RHFSelect
                  name="productTypeId"
                  size="small"
                  label={
                    <Box sx={{ display: 'flex' }}>
                      <FormattedMessage id="label.productType" />
                      <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                    </Box>
                  }
                  options={arrayToSelectOptions(productTypeData, 'productTypeName', 'productTypeId')}
                />
              </Grid>
              <Grid item md={6}>
                <RHFSelect
                  name="materialTypeId"
                  size="small"
                  label={
                    <Box sx={{ display: 'flex' }}>
                      <FormattedMessage id="label.materialType" />
                      <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                    </Box>
                  }
                  options={enumToSelectOptions(MaterialTypeEnum)}
                />
              </Grid>
              <Grid item md={6}>
                <RHFSelect
                  name="hairStyleId"
                  size="small"
                  label={
                    <Box sx={{ display: 'flex' }}>
                      <FormattedMessage id="label.hairStyle" />
                      <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                    </Box>
                  }
                  options={enumToSelectOptions(HairStyleEnum)}
                  getOptionLabel={(option) => {
                    return <FormattedMessage id={`enum.${HairStyleDisplayConfig[option.id]}`} />;
                  }}
                />
              </Grid>
              <Grid item md={4}>
                <RHFSelect
                  name="measureUnitLengthId"
                  size="small"
                  label={
                    <Box sx={{ display: 'flex' }}>
                      <FormattedMessage id="label.measureUnitLength" />
                      <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                    </Box>
                  }
                  options={enumToSelectOptions(LengthMeasureUnitEnum)}
                  getOptionLabel={(option) => {
                    return <FormattedMessage id={`enum.${LengthMeasureUnitDisplayConfig[option.id]}`} />;
                  }}
                />
              </Grid>
              <Grid item md={4}>
                <RHFTextField
                  name="fromLength"
                  size="small"
                  label={
                    <Box sx={{ display: 'flex' }}>
                      <FormattedMessage id="label.fromLength" />
                      <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                    </Box>
                  }
                />
              </Grid>
              <Grid item md={4}>
                <RHFTextField
                  name="toLength"
                  size="small"
                  label={
                    <Box sx={{ display: 'flex' }}>
                      <FormattedMessage id="label.toLength" />
                      <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                    </Box>
                  }
                />
              </Grid>
              <Grid item md={6}>
                <RHFSelect
                  name="measureUnitWeightId"
                  size="small"
                  label={
                    <Box sx={{ display: 'flex' }}>
                      <FormattedMessage id="label.measureUnitWeight" />
                      <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                    </Box>
                  }
                  options={enumToSelectOptions(WeightMeasureUnitEnum)}
                />
              </Grid>
              <Grid item md={6}>
                <RHFTextField
                  name="weight"
                  size="small"
                  label={
                    <Box sx={{ display: 'flex' }}>
                      <FormattedMessage id="label.weight" />
                      <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                    </Box>
                  }
                />
              </Grid>
              <Grid item md={6}>
                <RHFTextField
                  name="origin"
                  size="small"
                  label={
                    <Box sx={{ display: 'flex' }}>
                      <FormattedMessage id="label.origin" />
                      <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                    </Box>
                  }
                />
              </Grid>
              <Grid item md={6}>
                <RHFSelect
                  name="packingRuleId"
                  size="small"
                  label={
                    <Box sx={{ display: 'flex' }}>
                      <FormattedMessage id="label.packingRule" />
                      <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                    </Box>
                  }
                  options={enumToSelectOptions(PackingRuleEnum)}
                  getOptionLabel={(option) => {
                    return <FormattedMessage id={`enum.${option.label}`} />;
                  }}
                />
              </Grid>
              <Grid item md={12}>
                <RHFTextField
                  name="videoUrl"
                  size="small"
                  label={
                    <Box sx={{ display: 'flex' }}>
                      <FormattedMessage id="label.videoUrl" />
                      <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                    </Box>
                  }
                />
              </Grid>
            </Grid>
            <Grid mt={2} container columns={12}>
              <Grid item md={6}>
                <Button variant="contained" onClick={addColor}>
                  <FormattedMessage id="button.createProduct" />
                </Button>
                <Box mt={2}>
                  {fields?.map((item, index) => {
                    return (
                      <Box key={item.id} display="flex" mt={3}>
                        <Box>
                          <RHFSelect
                            size="small"
                            name={`colors.${index}.colorId`}
                            label="Màu"
                            options={arrayToSelectOptions(colorData, 'colorName', 'colorId')}
                          />

                          <Controller
                            name={`colors.${index}.images`}
                            control={control}
                            render={({ field }) => (
                              <MultiImageUpload
                                file={`image${index}`}
                                setImageIds={field.onChange}
                                images={data?.colors[index]?.images}
                                setIsLoading={setIsLoading}
                                setToggle={setToggle}
                                toggle={toggle}
                              />
                            )}
                          />
                          <Stack>
                            <RHFCheckbox
                              name={`colors.${index}.isBestSelling`}
                              label={<FormattedMessage id="label.isBestSelling" />}
                            />
                            <RHFCheckbox
                              name={`colors.${index}.isEnabled`}
                              label={<FormattedMessage id="label.isEnabled" />}
                            />
                            <Button
                              sx={{ width: '400px', display: 'flex', mr: 'auto', ml: 'auto' }}
                              variant="outlined"
                              color="error"
                              onClick={() => {
                                removeColor(index);
                              }}
                            >
                              <FormattedMessage id="button.delete" />
                            </Button>
                          </Stack>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Grid>
              <Grid item md={6}>
                <Stack spacing={2.5}>
                  <RHFTextField
                    name="descriptionEn"
                    size="small"
                    multiline
                    label={
                      <Box sx={{ display: 'flex' }}>
                        <FormattedMessage id="label.descriptionEn" />
                        <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                      </Box>
                    }
                  />
                  <RHFTextField
                    name="descriptionRu"
                    size="small"
                    multiline
                    label={
                      <Box sx={{ display: 'flex' }}>
                        <FormattedMessage id="label.descriptionRu" />
                        <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                      </Box>
                    }
                  />
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" type="submit" disabled={!isValid || !isDirty}>
            {!!product ? intl.formatMessage({ id: 'button.update' }) : intl.formatMessage({ id: 'button.create' })}
          </Button>
          <Button variant="outlined" onClick={close}>
            <FormattedMessage id="button.cancel" />
          </Button>
        </DialogActions>
      </FormProvider>
    </CustomDialog>
  );
};

export default ProductEditModal;
