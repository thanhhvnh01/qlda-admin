import { Avatar, Box } from '@mui/material';
// import { createPhysicalFileAPI, putUploadDoneAPI, putUploadImageAPI } from '@api/main';
import { createPhysicalFileAPI } from '@api/main';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const AltPicture = ({ isSupporterImage }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: 83,
        height: 83,
        mt: 1,
        borderRadius: !!isSupporterImage ? '50%' : 2,
        borderStyle: 'dashed',
        borderWidth: '1px',
        alignItems: 'center',
        borderColor: '#CCD5DE',
        backgroundColor: '#F4F6F8',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', mr: 'auto', ml: 'auto', alignItems: 'center' }}>
        <UploadFileIcon />
      </Box>
    </Box>
  );
};

const ImageUpload = ({
  picture,
  setFile,
  setPhysicalFile,
  previewFile,
  setPreviewFile,
  isSupporterImage,
  isCover,
  setImageId,
}) => {
  const onUploadChange = async (e, setFile, setPhysicalFile, setPreviewFile) => {
    if (!!e.target.files[0]) {
      setFile(e.target.files[0]);
      // const res = await createPhysicalFileAPI({
      //   fileName: e.target.files[0].name,
      //   fileLength: e.target.files[0].size,
      // });
      // setPhysicalFile(res.data);

      const reader = new FileReader();
      const files = e.target.files[0];
      reader.onload = () => {
        setPreviewFile(reader.result);
      };
      if (files) {
        reader.readAsDataURL(files);
      }
      // setImageId(res.data.physicalFileId);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mr: 'auto',
        ml: 'auto',
      }}
      className="image-upload"
    >
      <label htmlFor={picture}>
        {!previewFile ? (
          <AltPicture isSupporterImage={isSupporterImage} />
        ) : (
          <Avatar
            variant="rounded"
            component="span"
            alt="picture"
            sx={{
              width: !!isCover ? 320 : 83,
              height: !!isCover ? 180 : 83,
              mt: 1,
              borderStyle: 'dashed',
              borderWidth: '1px',
              borderRadius: !!isSupporterImage ? '50%' : 2,
              alignItems: 'center',
              borderColor: '#CCD5DE',
            }}
            src={previewFile}
          />
        )}

        <input
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(event) => onUploadChange(event, setFile, setPhysicalFile, setPreviewFile)}
          type="file"
          id={picture}
        />
      </label>
    </Box>
  );
};

export default ImageUpload;
