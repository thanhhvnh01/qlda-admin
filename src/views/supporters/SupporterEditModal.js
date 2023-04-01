import { getErrorMessage } from '@api/handleApiError';
import {
  createSupporterAPI,
  getDetailsSupporterAPI,
  putUploadDoneAPI,
  putUploadImageAPI,
  updateSupporterAPI,
} from '@api/main';
import CustomDialog from '@components/CustomDialog';
import { FormProvider, RHFTextField } from '@components/hook-forms';
import ImageUpload from '@components/ImageUpload';
import UILoader from '@components/UILoader';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, DialogActions, DialogTitle, Stack, useTheme } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import * as yup from 'yup';

const SupporterEditModal = ({ open, close, supporter }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const intl = useIntl();
  // hooks
  const theme = useTheme();
  // image
  const [file, setFile] = useState();
  const [image, setImage] = useState();
  const [physicalFile, setPhysicalFile] = useState();

  const supporterModalSchema = yup.object().shape({
    avatarId: yup.number().required(),
    supporterName: yup.string().required().max(128).trim(),
    phoneNumber: yup.string().required().max(16).trim(),
    email: yup.string().email().required().max(128).trim(),
    facebookUrl: yup.string().nullable().trim(),
    instagramUrl: yup.string().nullable().trim(),
    whatsappPhoneNumber: yup.string().required().max(16).trim(),
  });

  const defaultValues = {
    avatarId: '',
    supporterName: '',
    phoneNumber: '',
    email: '',
    facebookUrl: '',
    instagramUrl: '',
    whatsappPhoneNumber: '',
  };

  const methods = useForm({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(supporterModalSchema),
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
      if (!!supporter) {
        const res = await getDetailsSupporterAPI(supporter.supporterId);
        reset({
          ...defaultValues,
          ...{
            avatarId: res.data.avatarId,
            supporterName: res.data.supporterName,
            phoneNumber: res.data.phoneNumber,
            email: res.data.email,
            facebookUrl: res.data.facebookUrl,
            instagramUrl: res.data.instagramUrl,
            whatsappPhoneNumber: res.data.whatsappPhoneNumber,
          },
        });
        setImage(res.data.avatarUrl);
        setPhysicalFile({ physicalFileId: res.data.avatarId });
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
  }, [supporter, reset]);

  const onSubmit = async (data) => {
    const formData = {
      avatarId: physicalFile.physicalFileId,
      supporterName: data.supporterName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      facebookUrl: data.facebookUrl,
      instagramUrl: data.instagramUrl,
      whatsappPhoneNumber: data.whatsappPhoneNumber,
    };
    try {
      if (!!file) {
        await putUploadImageAPI(physicalFile.presignedUploadUrl, file);
        await putUploadDoneAPI({ physicalFileIds: [physicalFile.physicalFileId] });
      }
      if (!!supporter) {
        await updateSupporterAPI(supporter.supporterId, formData);
      } else {
        await createSupporterAPI(formData);
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
        {!!supporter
          ? intl.formatMessage({ id: 'label.updateSupporter' })
          : intl.formatMessage({ id: 'label.createSupporter' })}
      </DialogTitle>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="avatarId"
          render={({ field }) => (
            <ImageUpload
              setFile={setFile}
              setPhysicalFile={setPhysicalFile}
              previewFile={image}
              setPreviewFile={setImage}
              setImageId={field.onChange}
              picture="image-supporter"
              isSupporterImage
            />
          )}
        />

        <Stack direction="column" spacing={2} sx={{ px: 5, mt: 2 }}>
          <Box>
            <RHFTextField
              name="supporterName"
              size="small"
              label={
                <Box sx={{ display: 'flex' }}>
                  <FormattedMessage id="label.supporterName" />
                  <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                </Box>
              }
            />
          </Box>
          <Box>
            <RHFTextField
              name="phoneNumber"
              size="small"
              label={
                <Box sx={{ display: 'flex' }}>
                  <FormattedMessage id="label.phoneNumber" />
                  <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                </Box>
              }
            />
          </Box>
          <Box>
            <RHFTextField
              name="email"
              size="small"
              label={
                <Box sx={{ display: 'flex' }}>
                  <FormattedMessage id="label.email" />
                  <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                </Box>
              }
            />
          </Box>
          <Box>
            <RHFTextField
              name="facebookUrl"
              size="small"
              label={
                <Box sx={{ display: 'flex' }}>
                  <FormattedMessage id="label.facebook" />
                  <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                </Box>
              }
            />
          </Box>
          <Box>
            <RHFTextField
              name="instagramUrl"
              size="small"
              label={
                <Box sx={{ display: 'flex' }}>
                  <FormattedMessage id="label.instagram" />
                  <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                </Box>
              }
            />
          </Box>
          <Box>
            <RHFTextField
              name="whatsappPhoneNumber"
              size="small"
              label={
                <Box sx={{ display: 'flex' }}>
                  <FormattedMessage id="label.whatsapp" />
                  <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                </Box>
              }
            />
          </Box>
        </Stack>
        <DialogActions sx={{ px: 5, mt: 1, mb: 1 }}>
          <Button variant="contained" type="submit" disabled={!isDirty || !isValid}>
            {!!supporter ? intl.formatMessage({ id: 'button.update' }) : intl.formatMessage({ id: 'button.create' })}
          </Button>
          <Button variant="outlined" onClick={close}>
            <FormattedMessage id="button.cancel" />
          </Button>
        </DialogActions>
      </FormProvider>
    </CustomDialog>
  );
};

export default SupporterEditModal;
