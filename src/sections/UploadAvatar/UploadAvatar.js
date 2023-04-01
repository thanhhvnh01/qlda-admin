import React, { useEffect, useState } from 'react';
import { Input } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';

import { createPhysicalFileAPI, putUploadImageAPI, putUploadDoneAPI } from '@api/main';
import defaultAvatar from '@assets/images/avatar-blank.png';
import { getErrorMessage } from '@api/handleApiError';
import UILoader from '@components/UILoader';
import { Edit } from 'react-feather';
import { useSnackbar } from 'notistack';
import { Button, CardMedia, Typography } from '@mui/material';
const UploadAvatar = ({ mode = 'avatar', physicalFileType, image, isEditable, setFileId }) => {
  const { enqueueSnackbar } = useSnackbar();

  const [file, setFile] = useState();
  const [previewFile, setPreviewFile] = useState(defaultAvatar);
  const [physicalFile, setPhysicalFile] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!!image) {
      setPreviewFile(image);
    }
  }, [image]);

  const onUploadChange = async (e) => {
    if (!!e.target.files[0]) {
      setFile(e.target.files[0]);
      const res = await createPhysicalFileAPI({
        fileName: e.target.files[0].name,
        fileLength: e.target.files[0].size,
        physicalFileType,
      });
      setPhysicalFile(res.data);

      const reader = new FileReader(),
        files = e.target.files;
      reader.onload = function () {
        setPreviewFile(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleUpload = async () => {
    try {
      setIsLoading(true);
      await putUploadImageAPI(physicalFile.presignedUploadUrl, file);
      await putUploadDoneAPI(physicalFile.physicalFileId);
      setFileId(physicalFile.physicalFileId);

      enqueueSnackbar(<FormattedMessage id="toast.success" defaultMessage="Success!" />, {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar(<FormattedMessage id={getErrorMessage(error)} defaultMessage={getErrorMessage(error)} />, {
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
      setFile();
    }
  };

  const handleRemove = () => {
    setFileId(null);
    setPreviewFile(defaultAvatar);
    setFile();
    setPhysicalFile();
  };

  return (
    <CardMedia>
      <CardMedia className="mr-25 rounded-circle" left>
        <Typography
          className={classnames('image-wrapper', { 'upload-avatar': mode === 'avatar' }, { active: isEditable })}
        >
          <div className="image-upload">
            {isEditable && <Input type="file" onChange={onUploadChange} hidden accept="image/*" />}
            <UILoader blocking={isLoading} className={classnames({ 'rounded-circle': mode === 'avatar' })}>
              <CardMedia
                object
                className={classnames({ 'rounded-circle': mode === 'avatar' })}
                style={{ objectFit: 'cover' }}
                src={previewFile}
                alt="Generic placeholder image"
                height={mode === 'avatar' ? 70 : 82}
                width={mode === 'avatar' ? 70 : 192}
              />
              {isEditable && <Edit size={18} color="white" className="overlay-icon" />}
            </UILoader>
          </div>
        </Typography>
      </CardMedia>
      <CardMedia>
        <Button color="primary" size="sm" onClick={handleUpload} disabled={!file || isLoading}>
          <FormattedMessage id="button.upload" />
        </Button>
        <Button color="secondary" size="sm" onClick={() => handleRemove()} outline>
          <FormattedMessage id="button.remove" />
        </Button>
        <br />
        <div className="mt-75">
          <FormattedMessage id="settings.imageDescription" defaultMessage="Allowed JPG, GIF or PNG. Max size of 2MB" />
        </div>
      </CardMedia>
    </CardMedia>
  );
};

export default UploadAvatar;
