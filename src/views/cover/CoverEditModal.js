import { getErrorMessage } from '@api/handleApiError';
import { createCoverAPI, getDetailsCoverAPI, putUploadDoneAPI, putUploadImageAPI, updateCoverAPI } from '@api/main';
import CustomDialog from '@components/CustomDialog';
import { FormProvider, RHFTextField } from '@components/hook-forms';
import ImageUpload from '@components/ImageUpload';
import UILoader from '@components/UILoader';
import { useTheme } from '@emotion/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, DialogActions, DialogTitle, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import * as yup from 'yup';

const CoverEditModal = ({ open, close, cover }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const intl = useIntl();
  // hooks
  const theme = useTheme();
  // image
  const [file, setFile] = useState();
  const [image, setImage] = useState();
  const [physicalFile, setPhysicalFile] = useState();

  const coverModalSchema = yup.object().shape({
    coverName: yup.string().required().max(128).trim(),
    physicalFileId: yup.number().required(),
  });

  const defaultValues = {
    coverName: '',
    physicalFileId: '',
  };

  const methods = useForm({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(coverModalSchema),
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
      if (!!cover) {
        const res = await getDetailsCoverAPI(cover.coverId);
        reset({
          ...defaultValues,
          ...{
            coverName: res.data.coverName,
            physicalFileId: res.data.fileId,
          },
        });
        setImage(res.data.fileUrl);
        setPhysicalFile({ physicalFileId: res.data.fileId });
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
  }, [cover, reset]);

  const onSubmit = async (data) => {
    const formData = {
      physicalFileId: physicalFile.physicalFileId,
      coverName: data.coverName,
    };
    try {
      if (!!file) {
        await putUploadImageAPI(physicalFile.presignedUploadUrl, file);
        await putUploadDoneAPI({ physicalFileIds: [physicalFile.physicalFileId] });
      }
      if (!!cover) {
        await updateCoverAPI(cover.coverId, formData);
      } else {
        await createCoverAPI(formData);
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
        {!!cover ? intl.formatMessage({ id: 'label.updateCover' }) : intl.formatMessage({ id: 'label.createCover' })}
      </DialogTitle>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="physicalFileId"
          render={({ field }) => (
            <ImageUpload
              setFile={setFile}
              setPhysicalFile={setPhysicalFile}
              previewFile={image}
              setPreviewFile={setImage}
              setImageId={field.onChange}
              picture="cover"
              isCover
            />
          )}
        />

        <Stack direction="column" spacing={2} sx={{ px: 5, mt: 2 }}>
          <Box>
            <RHFTextField
              name="coverName"
              size="small"
              label={
                <Box sx={{ display: 'flex' }}>
                  <FormattedMessage id="label.coverName" />
                  <Box sx={{ color: theme.palette.error.main }}>&nbsp;*</Box>
                </Box>
              }
            />
          </Box>
        </Stack>
        <DialogActions sx={{ px: 5, mt: 1, mb: 1 }}>
          <Button variant="contained" type="submit" disabled={!isValid || !isDirty}>
            {!!cover ? intl.formatMessage({ id: 'button.update' }) : intl.formatMessage({ id: 'button.create' })}
          </Button>
          <Button variant="outlined" onClick={close}>
            <FormattedMessage id="button.cancel" />
          </Button>
        </DialogActions>
      </FormProvider>
    </CustomDialog>
  );
};

export default CoverEditModal;
