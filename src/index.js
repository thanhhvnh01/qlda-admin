import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
//
import { IntlProviderWrapper } from 'src/utilities/context/IntlProviderWrapper';
import App from './App';

// ** Redux Imports
import { Provider } from 'react-redux';
import { store } from './redux/store';

// ** Contexts
import { SignalRContext } from '@utilities/context/SignalRContext';
// ----------------------------------------------------------------------

ReactDOM.render(
  <Provider store={store}>
    <HelmetProvider>
      <BrowserRouter>
        <SignalRContext>
          <IntlProviderWrapper>
            <App />
          </IntlProviderWrapper>
        </SignalRContext>
      </BrowserRouter>
    </HelmetProvider>
  </Provider>,

  document.getElementById('root')
);
