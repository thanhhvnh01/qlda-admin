import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// @mui
import { Box, Checkbox, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { OrderByTypeEnum } from '@utilities/constants';
// ----------------------------------------------------------------------

const visuallyHidden = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
};

TableHeader.propTypes = {
  orderByType: PropTypes.oneOf([OrderByTypeEnum.Asc, OrderByTypeEnum.Desc]),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number,
  headLabel: PropTypes.array,
  numSelected: PropTypes.number,
  onRequestSort: PropTypes.func,
  onSelectAllClick: PropTypes.func,
};

export const convertOrderByTypeToOrderConfig = {
  [OrderByTypeEnum.Asc]: 'asc',
  [OrderByTypeEnum.Desc]: 'desc',
};

export default function TableHeader({
  orderByType,
  orderBy,
  rowCount,
  headLabel,
  numSelected,
  onRequestSort,
  onSelectAllClick,
}) {
  const createSortHandler = (property) => () => {
    onRequestSort(property);
  };

  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <TableHead>
      <TableRow>
        {!!onSelectAllClick && (
          <TableCell
            sx={{
              ...(rowCount > 0 &&
                numSelected === rowCount && {
                  bgcolor: isLight ? 'primary.lighter' : 'primary.dark',
                }),
            }}
            padding="checkbox"
          >
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
        )}
        {headLabel.map((headCell) => (
          <TableCell
            sx={{
              ...(rowCount > 0 &&
                numSelected === rowCount && {
                  bgcolor: isLight ? 'primary.lighter' : 'primary.dark',
                }),
              ...(headCell.minWidth && {
                minWidth: headCell.minWidth,
              }),
            }}
            key={headCell.id}
            align={headCell.align}
            sortDirection={
              orderBy === headCell.id && !!headCell.sortable ? convertOrderByTypeToOrderConfig[orderByType] : false
            }
            style={{ minWidth: headCell.minWidth }}
          >
            {!!headCell.sortable ? (
              <TableSortLabel
                hideSortIcon
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? convertOrderByTypeToOrderConfig[orderByType] : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {!!headCell.label && (
                  <FormattedMessage id={`label.${headCell.label}`} defaultMessage={headCell.label} />
                )}
                {orderBy === headCell.id ? (
                  <Box sx={{ ...visuallyHidden }}>
                    {orderByType === OrderByTypeEnum.Desc ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              <>
                {!!headCell.label && (
                  <FormattedMessage id={`label.${headCell.label}`} defaultMessage={headCell.label} />
                )}
              </>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
