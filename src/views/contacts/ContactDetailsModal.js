import { getErrorMessage } from '@api/handleApiError';
import { getDetailsContactAPI } from '@api/main';
import CustomDialog from '@components/CustomDialog';
import UILoader from '@components/UILoader';
import { Box, DialogTitle, Grid, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CloseIcon from '@mui/icons-material/Close';

const ContactDetailsModal = ({ open, close, contact }) => {
  const [data, setData] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await getDetailsContactAPI(contact.contactId);
      setData(res.data);
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
  }, [contact]);

  return (
    <CustomDialog fullWidth open={open} onClose={close}>
      <UILoader open={isLoading} />
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {intl.formatMessage({ id: 'label.details' })}
        <CloseIcon
          onClick={() => {
            close();
          }}
          sx={{ cursor: 'pointer' }}
        />
      </DialogTitle>
      <Box  sx={{ width: '100%', pl: '24px' }}>
        <Grid container rowSpacing={0}>
          <Grid item xs={6} sx={{pb: 1}}>
            <Typography><b sx={{fontWeight: 550}}>{`${intl.formatMessage({ id: 'label.firstName' })}: `}</b> {`${data?.firstName}`}</Typography>
          </Grid>
          <Grid item xs={6} sx={{pb: 1}}>
            <Typography><b sx={{fontWeight: 550}}>{`${intl.formatMessage({ id: 'label.lastName' })}: `} </b>{`${data?.lastName}`}</Typography>
          </Grid>
          <Grid item xs={12} sx={{pb: 1}}>
            <Typography><b sx={{fontWeight: 550}}>{`${intl.formatMessage({ id: 'label.email' })}: `}</b>{`${data?.email}`}</Typography>
          </Grid>
          <Grid item xs={12} sx={{pb: 1}}>
            <Typography><b sx={{fontWeight: 550}}>{`${intl.formatMessage({ id: 'label.phoneNumber' })}: `}</b>{`${data?.phoneNumber}`}</Typography>
          </Grid>
          <Grid item xs={12} sx={{pb: 1}}>
            <Typography><b sx={{fontWeight: 550}}>{`${intl.formatMessage({ id: 'label.productName' })}: `}</b>{`${
              data?.productName ? data.productName : ''
            }`}</Typography>
          </Grid>
          <Grid item xs={12} sx={{pb: 2}}>
            <Typography><b sx={{fontWeight: 550}}>{`${intl.formatMessage({ id: 'label.message' })}: `}</b>{`${
              data?.message ? data.message : ''
            }`}</Typography>
          </Grid>
        </Grid>
      </Box>
    </CustomDialog>
  );
};

export default ContactDetailsModal;
