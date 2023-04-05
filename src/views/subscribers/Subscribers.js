import { getErrorMessage } from '@api/handleApiError';
import { getSubscribesAPI } from '@api/main';
import Scrollbar from '@components/scrollbar';
import TableHeader from '@components/TableComponent/TableHeader';
import UILoader from '@components/UILoader';
import {
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
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

const TABLE_HEAD = [
  { id: 'id', label: 'STT', align: 'center' },
  { id: 'email', label: 'email', align: 'left' },
  { id: 'create', label: 'Ngày đăng kí', align: 'left' },
];

const Subscribers = ({ handleError403 }) => {
  const [refreshToggle] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);
  const [data, setData] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getSubscribesAPI();
      setData(response.data);
      // setTotalRows(response.data.paging.totalItem);
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
                      <TableRow key={index} hover>
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
                              {item.timeStamp}
                            </Typography>
                          </Box>
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
      </Container>
    </>
  );
};

export default Subscribers;
