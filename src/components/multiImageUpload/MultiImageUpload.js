import { getErrorMessage } from '@api/handleApiError';
import { putUploadDoneAPI, putUploadImageAPI } from '@api/main';
import ImageUpload from '@components/ImageUpload';
import { Box, Button, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

const MultiImageUpload = ({ file, setImageIds, images, setIsLoading, setToggle, toggle }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [file1, setFile1] = useState();
  const [file2, setFile2] = useState();
  const [file3, setFile3] = useState();
  const [file4, setFile4] = useState();
  const [file5, setFile5] = useState();

  const [image1, setImage1] = useState();
  const [image2, setImage2] = useState();
  const [image3, setImage3] = useState();
  const [image4, setImage4] = useState();
  const [image5, setImage5] = useState();
  // physical file section
  const [physicalFile1, setPhysicalFile1] = useState();
  const [physicalFile2, setPhysicalFile2] = useState();
  const [physicalFile3, setPhysicalFile3] = useState();
  const [physicalFile4, setPhysicalFile4] = useState();
  const [physicalFile5, setPhysicalFile5] = useState();

  const [arrayIds, setArrayIds] = useState([]);

  useEffect(() => {
    if (!!images) {
      setImage1(images[0]?.imageFileUrl);
      setImage2(images[1]?.imageFileUrl);
      setImage3(images[2]?.imageFileUrl);
      setImage4(images[3]?.imageFileUrl);
      setImage5(images[4]?.imageFileUrl);
      setPhysicalFile1({ imageId: images[0]?.imageId, physicalFileId: null });
      setPhysicalFile2({ imageId: images[1]?.imageId, physicalFileId: null });
      setPhysicalFile3({ imageId: images[2]?.imageId, physicalFileId: null });
      setPhysicalFile4({ imageId: images[3]?.imageId, physicalFileId: null });
      setPhysicalFile5({ imageId: images[4]?.imageId, physicalFileId: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  useEffect(() => {
    const array = [];
    array.push(physicalFile1, physicalFile2, physicalFile3, physicalFile4, physicalFile5);
    let arrayId = [];
    if (!!images) {
      arrayId = array?.map((i) => {
        if (!!i?.physicalFileId) {
          return undefined;
        } else {
          return i?.imageId;
        }
      });
    }
    if (toggle === true) {
      arrayId = array?.map((i) => {
        if (!!i?.physicalFileId) {
          return i.physicalFileId;
        } else {
          return i?.imageId;
        }
      });
    }

    const filterData = arrayId?.filter((i) => {
      return i !== undefined;
    });
    setArrayIds(filterData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggle, images, image1, image2, image3, image4, image5]);

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const array = [];
      const fileArray = [];
      array.push(physicalFile1, physicalFile2, physicalFile3, physicalFile4, physicalFile5);
      fileArray.push(file1, file2, file3, file4, file5);
      const requestUploadData = array.map((x, i) => {
        return { ...x, file: fileArray[i] };
      });
      const filterData = requestUploadData.filter((i) => {
        return i.presignedUploadUrl !== undefined;
      });
      const arrayIds = array.map((i) => {
        return i?.physicalFileId;
      });
      const filterIds = arrayIds.filter((i) => {
        return i !== null;
      });
      setImageIds([
        {
          imageId: physicalFile1?.physicalFileId === null ? physicalFile1?.imageId : physicalFile1?.physicalFileId,
          isMainImage: true,
        },
        {
          imageId: physicalFile2?.physicalFileId === null ? physicalFile2?.imageId : physicalFile2?.physicalFileId,
          isMainImage: false,
        },
        {
          imageId: physicalFile3?.physicalFileId === null ? physicalFile3?.imageId : physicalFile3?.physicalFileId,
          isMainImage: false,
        },
        {
          imageId: physicalFile4?.physicalFileId === null ? physicalFile4?.imageId : physicalFile4?.physicalFileId,
          isMainImage: false,
        },
        {
          imageId: physicalFile5?.physicalFileId === null ? physicalFile5?.imageId : physicalFile5?.physicalFileId,
          isMainImage: false,
        },
      ]);
      const promises = [];
      filterData.forEach((i) => {
        promises.push(putUploadImageAPI(i.presignedUploadUrl, i.file));
      });
      await Promise.all(promises);
      await putUploadDoneAPI({ physicalFileIds: filterIds });
      setIsLoading(false);
      setToggle(true);
      enqueueSnackbar('Tải ảnh thành công !', {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar(<FormattedMessage id={getErrorMessage(error)} defaultMessage={getErrorMessage(error)} />, {
        variant: 'error',
      });
    }
  };

  return (
    <Stack spacing={1} direction="row">
      <ImageUpload
        setFile={setFile1}
        setPhysicalFile={setPhysicalFile1}
        previewFile={image1}
        setPreviewFile={setImage1}
        picture={`file${file}1`}
      />
      <ImageUpload
        setFile={setFile2}
        setPhysicalFile={setPhysicalFile2}
        previewFile={image2}
        setPreviewFile={setImage2}
        picture={`file${file}2`}
      />
      <ImageUpload
        setFile={setFile3}
        setPhysicalFile={setPhysicalFile3}
        setPreviewFile={setImage3}
        previewFile={image3}
        picture={`file${file}3`}
      />
      <ImageUpload
        setFile={setFile4}
        setPhysicalFile={setPhysicalFile4}
        setPreviewFile={setImage4}
        previewFile={image4}
        picture={`file${file}4`}
      />
      <Box>
        <Button
          disabled={arrayIds.length === 5}
          variant="contained"
          sx={{ height: '35px', width: '80px', mt: 4, ml: 1 }}
          onClick={() => {
            onSubmit();
          }}
        >
          Tải Lên
        </Button>
      </Box>
    </Stack>
  );
};

export default MultiImageUpload;
