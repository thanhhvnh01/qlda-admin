// routes
import Router from './router/Router';

// theme
import ThemeProvider from './theme';
// components
import { MotionLazyContainer } from '@components/animate';
import NotistackProvider from '@components/NotistackProvider';
import { ConfirmationDialogProvider } from '@utilities/context/ConfirmationDialog';
import ScrollToTop from './components/scroll-to-top';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeProvider>
      <NotistackProvider>
        <MotionLazyContainer>
          <ConfirmationDialogProvider>
            <ScrollToTop />
            <Router />
          </ConfirmationDialogProvider>
        </MotionLazyContainer>
      </NotistackProvider>
    </ThemeProvider>
  );
}
