// @mui
import { Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// hooks
import useResponsive from '@hooks/useResponsive';
// components
import Logo from '@components/logo';

import { useState } from 'react';
// @mui
import { LoadingButton } from '@mui/lab';
import { Alert, IconButton, InputAdornment, Link, Stack } from '@mui/material';
// components
import Iconify from '@components/iconify';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { EmailPhoneNumberRegExp } from 'src/utilities/constants';

import { getErrorMessage } from '@api/handleApiError';
import { loginAPI } from '@api/main';
import { FormProvider, RHFTextField } from '@components/hook-forms';
import { loginAC } from '@store/actions/auth';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const mdUp = useResponsive('up', 'md');
  const intl = useIntl();

  const dispath = useDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = yup.object().shape({
    userName: yup
      .string()
      .matches(EmailPhoneNumberRegExp, intl.formatMessage({ id: 'formError.emailPhoneNumber' }))
      .trim()
      .required()
      .max(256),
    password: yup.string().required(),
  });

  const defaultValues = {
    userName: '',
    password: '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      setErrorMessage('');
      const newData = { userName: data.userName, password: data.password };
      const res = await loginAPI(newData);
      dispath(loginAC(res.data));
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };
  return (
    <>
      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <img src="/assets/illustrations/illustration_login.png" alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Đăng nhập
            </Typography>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={3}>
                <RHFTextField name="userName" label={intl.formatMessage({ id: 'label.userName' })} />

                <RHFTextField
                  name="password"
                  label={intl.formatMessage({ id: 'label.password' })}
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                <Link variant="subtitle2" underline="hover">
                  Quên mật khẩu?
                </Link>
              </Stack>

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                disabled={isSubmitting || !isValid}
              >
                <FormattedMessage id="button.signIn" defaultMessage="Sign in" />
              </LoadingButton>
            </FormProvider>
            {errorMessage && (
              <Alert severity="error" sx={{ mt: 3 }}>
                <FormattedMessage
                  id={errorMessage}
                  defaultMessage={`Unknown error, please contact technical supporter (${errorMessage})`}
                />
              </Alert>
            )}
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
