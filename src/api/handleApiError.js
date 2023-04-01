// Known error code
export const ERROR_CODES = {
  NEED_VERIFY_ACCOUNT: 'PINT_17',
  INVALID_EMAIL_OR_PASSWORD: 'PINT_44',
};

// All api error
export const API_ERRORS = {
  PINT_17: {
    message: 'You need to verify your account',
  },
};

export const getErrorMessage = (error, defaultMessage = 'apiError.unknown') => {
  if (error?.response?.metadata) {
    return `apiError.${error.response.metadata.messages[0].code}`;
  }
  return error.message || defaultMessage;
};

export const hasError = (error, errorCode) => {
  return !!error?.response?.metadata?.messages?.find((msg) => msg.code === errorCode);
};
