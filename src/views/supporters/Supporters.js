import { getErrorMessage } from '@api/handleApiError';
import { deleteSupporterAPI, getSupportersAPI, setEnabledSupporterAPI } from '@api/main';
import Iconify from '@components/iconify';
import Label from '@components/label';
import Scrollbar from '@components/scrollbar';
import SearchInput from '@components/SearchInput';
import TableHeader from '@components/TableComponent/TableHeader';
import UILoader from '@components/UILoader';
import {
  Avatar,
  Button,
  Card,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useConfirmationDialog } from '@utilities/context/ConfirmationDialog';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import SupporterEditModal from './SupporterEditModal';
import SupporterMoreActions from './SupporterMoreActions';

const TABLE_HEAD = [
  { id: 'id', label: 'STT', align: 'center' },
  { id: 'supporter', label: 'supporter', align: 'left' },
  { id: 'phoneNumber', label: 'phoneNumber', align: 'left' },
  { id: 'email', label: 'email', align: 'left' },
  { id: 'status', label: 'status', algin: 'left' },
  { id: 'more' },
];

const Suporters = ({ handleError403 }) => {
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState();

  const [editModalOpen, setEditModalOpen] = useState(false);

  const { showConfirmationDialog } = useConfirmationDialog();
  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();

  const fetchData = async (pageSize, pageNumber, keyword) => {
    try {
      setLoading(true);
      const response = await getSupportersAPI(pageSize, pageNumber, keyword);
      setData(response.data.pageData);
      setTotalRows(response.data.paging.totalItem);
    } catch (error) {
      enqueueSnackbar(<FormattedMessage id={getErrorMessage(error)} defaultMessage={getErrorMessage(error)} />, {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pageSize, pageNumber + 1, keyword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToggle, pageSize, pageNumber, keyword]);

  const handleOpenAddModal = () => {
    setSelectedData();
    setEditModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setSelectedData(item);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = (modalResult) => {
    setEditModalOpen(!editModalOpen);
    if (modalResult === 'SAVED') {
      setRefreshToggle(!refreshToggle);
    }
  };

  const handlePageNumberChange = (e, pageNumber) => {
    setLoading(true);
    setPageNumber(pageNumber);
  };

  const handlePageSizeChange = (newPerPage) => {
    setLoading(true);
    setPageNumber(0);
    setPageSize(newPerPage.target.value);
  };

  const handleSearch = async (value) => {
    setPageNumber(0);
    setKeyword(value);
  };

  const handleSetEnabled = async (supporter) => {
    try {
      await setEnabledSupporterAPI(supporter.supporterId, { isEnabled: !supporter.isEnabled });
      setRefreshToggle(!refreshToggle);
      enqueueSnackbar(<FormattedMessage id="toast.success" defaultMessage="Success!" />, {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar(<FormattedMessage id={getErrorMessage(error)} defaultMessage={getErrorMessage(error)} />, {
        variant: 'error',
      });
    }
  };

  const handleDelete = async (supporter) => {
    try {
      const isConfirmed = await showConfirmationDialog({
        title: intl.formatMessage({ id: 'dialog.deleteSupporterTitle' }),
        message: intl.formatMessage(
          {
            id: 'dialog.deleteSupporter',
          },
          { name: <strong>{supporter.supporterName}</strong> }
        ),
      });

      if (!isConfirmed) {
        return;
      }

      await deleteSupporterAPI(supporter.supporterId);
      setRefreshToggle(!refreshToggle);
      enqueueSnackbar(<FormattedMessage id="toast.success" defaultMessage="Success!" />, {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar(<FormattedMessage id={getErrorMessage(error)} defaultMessage={getErrorMessage(error)} />, {
        variant: 'error',
      });
    }
  };

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            <FormattedMessage id="label.imageBackgroundName" />
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAddModal}>
            <FormattedMessage id="button.create" />
          </Button>
        </Stack>
        <Card>
          <UILoader open={isLoading} />
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ px: 3, py: 2 }}
          >
            <SearchInput onChange={handleSearch} />
          </Box>
          <Scrollbar>
            <TableContainer>
              <Table>
                <TableHeader headLabel={TABLE_HEAD} rowCount={data.length} />
                <TableBody>
                  {data?.map((item, index) => {
                    return (
                      <TableRow key={item.supporterId} hover>
                        <TableCell padding="normal" align="center">
                          <Box>
                            <Typography>{pageNumber * pageSize + index + 1}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box sx={{ display: 'inline-flex' }}>
                            <Avatar src={item.avatarUrl} sx={{ width: 56, height: 56 }} />
                            <Typography sx={{ mt: 2, ml: 2 }} height="25px" variant="subtitle2" noWrap>
                              {item.supporterName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box>
                            <Typography variant="subtitle3" noWrap>
                              {item.phoneNumber}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box>
                            <Typography variant="subtitle3" noWrap>
                              {item.email}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Label color={item.isEnabled ? 'success' : 'error'}>
                            {item.isEnabled
                              ? intl.formatMessage({ id: 'label.active' })
                              : intl.formatMessage({ id: 'label.inactive' })}
                          </Label>
                        </TableCell>
                        <TableCell align="right">
                          <SupporterMoreActions
                            handleOpenEditModal={() => {
                              handleOpenEditModal(item);
                            }}
                            handleSetEnabled={handleSetEnabled}
                            handleDelete={handleDelete}
                            item={item}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            page={pageNumber}
            count={totalRows}
            rowsPerPage={pageSize}
            onPageChange={handlePageNumberChange}
            onRowsPerPageChange={handlePageSizeChange}
          /> */}
        </Card>
        {editModalOpen && (
          <SupporterEditModal open={editModalOpen} close={handleCloseEditModal} supporter={selectedData} />
        )}
      </Container>
    </>
  );
};

export default Suporters;
