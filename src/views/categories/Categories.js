import { getErrorMessage } from '@api/handleApiError';
import { deleteCategoryAPI, getCategoriesAPI, setEnabledCategoryAPI } from '@api/main';
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
  TableRow,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useConfirmationDialog } from '@utilities/context/ConfirmationDialog';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import CategoryEditModal from './CategoryEditModal';
import CategoryMoreActions from './CategoryMoreActions';

const TABLE_HEAD = [
  { id: 'id', label: 'STT', align: 'center' },
  { id: 'categoryNameEn', label: 'productType', align: 'left' },
  { id: 'status', label: 'status', align: 'left' },
  { id: 'more' },
];

const Categories = ({ handleError403 }) => {
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getCategoriesAPI();
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

  const handleSetEnabled = async (category) => {
    try {
      await setEnabledCategoryAPI(category.categoryId, { isEnabled: !category.isEnabled });
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

  const handleDelete = async (category) => {
    try {
      const isConfirmed = await showConfirmationDialog({
        title: intl.formatMessage({ id: 'dialog.deleteCategoryTitle' }),
        message: intl.formatMessage(
          {
            id: 'dialog.deleteCategory',
          },
          { name: <strong>{category.categoryNameEn}</strong> }
        ),
      });

      if (!isConfirmed) {
        return;
      }

      await deleteCategoryAPI(category.categoryId);
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
                <TableHeader headLabel={TABLE_HEAD} />
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
                              {item.brandName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Label color={'success'}>{intl.formatMessage({ id: 'label.active' })}</Label>
                        </TableCell>
                        <TableCell align="right">
                          <CategoryMoreActions
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
        </Card>
        {editModalOpen && (
          <CategoryEditModal open={editModalOpen} close={handleCloseEditModal} category={selectedData} />
        )}
      </Container>
    </>
  );
};

export default Categories;
