import { FormattedMessage } from 'react-intl';

const FormError = ({ children }) => {
  try {
    const data = JSON.parse(children);
    if (!!data.id) {
      return <FormattedMessage {...data} />;
    }
  } catch {
    // Couldn't parse as JSON; do nothing
  }
  return <FormattedMessage id={children} defaultMessage={children} />;
};

export default FormError;
