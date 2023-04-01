import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import debounce from 'lodash.debounce';

import Iconify from '@components/iconify';
import { InputAdornment, OutlinedInput } from '@mui/material';

const SearchInput = ({ type = 'text', onChange, ...rest }) => {
  const [key, setKey] = useState('');
  const intl = useIntl();

  const debouncedOnChange = useCallback(debounce(onChange, 400), []);
  return (
    <OutlinedInput
      type={type}
      value={key}
      onChange={(e) => {
        setKey(e.target.value);
        debouncedOnChange(e.target.value);
      }}
      placeholder={intl.formatMessage({ id: 'placeholder.searchInput' })}
      startAdornment={
        <InputAdornment position="start">
          <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
        </InputAdornment>
      }
      {...rest}
    />
  );
};

export default SearchInput;
