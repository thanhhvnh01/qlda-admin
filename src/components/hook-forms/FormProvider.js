import { Box } from '@mui/material';
import PropTypes from 'prop-types';
// form
import { FormProvider as Form } from 'react-hook-form';

// ----------------------------------------------------------------------

FormProvider.propTypes = {
  children: PropTypes.node.isRequired,
  methods: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
};

export default function FormProvider({ children, onSubmit, methods }) {
  return (
    <Form {...methods}>
      <Box sx={{ height: '100%' }}>
        <form style={{ display: 'flex', flexDirection: 'column', height: '100%' }} onSubmit={onSubmit}>
          {children}
        </form>
      </Box>
    </Form>
  );
}
