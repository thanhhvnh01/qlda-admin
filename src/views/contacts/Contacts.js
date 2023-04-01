import { getErrorMessage } from '@api/handleApiError';
import { getContactsAPI } from '@api/main';
import Scrollbar from '@components/scrollbar';
import TableHeader from '@components/TableComponent/TableHeader';
import UILoader from '@components/UILoader';
import {
  Card,
  Container,
  IconButton,
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
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import InfoIcon from '@mui/icons-material/Info';
import ContactDetailsModal from './ContactDetailsModal';
import { format } from 'date-fns';

const TABLE_HEAD = [
  { id: 'id', label: 'STT', align: 'center' },
  { id: 'email', label: 'email', align: 'left' },
  { id: 'productName', label: 'product', align: 'left' },
  { id: 'message', label: 'message', align: 'left' },
  { id: 'create', label: 'Ngày gửi', align: 'left' },
  { id: 'details' },
];

const Contacts = ({ handleError403 }) => {
  const [refreshToggle] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);
  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState();
  const [modalOpen, setModalOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async (pageSize, pageNumber) => {
    try {
      setLoading(true);
      const response = await getContactsAPI(pageSize, pageNumber);
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
    fetchData(pageSize, pageNumber + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToggle, pageSize, pageNumber]);

  const handlePageNumberChange = (e, pageNumber) => {
    setLoading(true);
    setPageNumber(pageNumber);
  };

  const handlePageSizeChange = (newPerPage) => {
    setLoading(true);
    setPageNumber(0);
    setPageSize(newPerPage.target.value);
  };

  const handleOpenModal = (item) => {
    setSelectedData(item);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            <FormattedMessage id="label.subscriber" />
          </Typography>
        </Stack>
        <Card>
          <UILoader open={isLoading} />
          <Scrollbar>
            <TableContainer>
              <Table>
                <TableHeader headLabel={TABLE_HEAD} rowCount={data.length} />
                <TableBody>
                  {data?.map((item, index) => {
                    return (
                      <TableRow key={item.contactId} hover>
                        <TableCell padding="normal" align="center">
                          <Box>
                            <Typography>{pageNumber * pageSize + index + 1}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box>
                            <Typography variant="subtitle2" noWrap>
                              {item.email}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box>
                            <Typography variant="subtitle2" noWrap>
                              {item.productName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box>
                            <Typography width="300px" variant="subtitle2" noWrap>
                              {item.message}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box>
                            <Typography variant="subtitle2" noWrap>
                              {format(item.createAtUnix, 'hh:mm | dd/MM/yyyy')}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell
                          align="right"
                          onClick={() => {
                            handleOpenModal(item);
                          }}
                        >
                          <IconButton>
                            <InfoIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            page={pageNumber}
            count={totalRows}
            rowsPerPage={pageSize}
            onPageChange={handlePageNumberChange}
            onRowsPerPageChange={handlePageSizeChange}
          />
        </Card>
        {modalOpen && <ContactDetailsModal open={modalOpen} close={handleCloseModal} contact={selectedData} />}
      </Container>
    </>
  );
};

export default Contacts;
