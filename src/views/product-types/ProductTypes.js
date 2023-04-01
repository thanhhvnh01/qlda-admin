import { getErrorMessage } from '@api/handleApiError';
import { deleteProductTypeAPI, getProductTypesAPI, setEnabledProductTypeAPI } from '@api/main';
import Iconify from '@components/iconify';
import Label from '@components/label';
import Scrollbar from '@components/scrollbar';
import SearchInput from '@components/SearchInput';
import TableHeader from '@components/TableComponent/TableHeader';
import UILoader from '@components/UILoader';
import {
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
import ProductTypeEditModal from './ProductTypeEditModal';
import ProductTypeMoreActions from './ProductTypeMoreActions';

const TABLE_HEAD = [
  { id: 'id', label: 'STT', align: 'center' },
  { id: 'productTypeNameEn', label: 'nameEn', align: 'left' },
  { id: 'productTypeNameRu', label: 'nameRu', align: 'left' },
  { id: 'categoryName', label: 'category', align: 'left' },
  { id: 'status', label: 'status', align: 'left' },
  { id: 'more' },
];

const ProductTypes = ({ handleError403 }) => {
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
      const response = await getProductTypesAPI(pageSize, pageNumber, keyword, { categoryId: null });
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

  const handleSetEnabled = async (productType) => {
    try {
      await setEnabledProductTypeAPI(productType.productTypeId, { isEnabled: !productType.isEnabled });
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

  const handleDelete = async (productType) => {
    try {
      const isConfirmed = await showConfirmationDialog({
        title: intl.formatMessage({ id: 'dialog.deleteProductTypeTitle' }),
        message: intl.formatMessage(
          {
            id: 'dialog.deleteProductType',
          },
          { name: <strong>{productType.productTypeNameEn}</strong> }
        ),
      });

      if (!isConfirmed) {
        return;
      }

      await deleteProductTypeAPI(productType.productTypeId);
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
            <FormattedMessage id="label.productType" />
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
                      <TableRow key={item.productTypeId} hover>
                        <TableCell padding="normal" align="center">
                          <Box>
                            <Typography>{pageNumber * pageSize + index + 1}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box>
                            <Typography variant="subtitle2" noWrap>
                              {item.productTypeNameEn}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box>
                            <Typography variant="subtitle3" noWrap>
                              {item.productTypeNameRu}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box>
                            <Typography variant="subtitle3" noWrap>
                              {item.categoryName}
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
                          <ProductTypeMoreActions
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
        {editModalOpen && (
          <ProductTypeEditModal open={editModalOpen} close={handleCloseEditModal} productType={selectedData} />
        )}
      </Container>
    </>
  );
};

export default ProductTypes;
