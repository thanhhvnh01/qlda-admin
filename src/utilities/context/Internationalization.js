// ** React Imports
import { useState, createContext } from 'react';

// ** Intl Provider Import
import { IntlProvider } from 'react-intl';

// ** User Language Data
import userMessagesEn from '@assets/locales/en.json';
import userMessagesVi from '@assets/locales/vi.json';

// ** Menu msg obj
const menuMessages = {
  en: userMessagesEn,
  vi: userMessagesVi,
};

// ** Create Context
const Context = createContext();

const IntlProviderWrapper = ({ children }) => {
  const initLang = localStorage.getItem('language') || 'en';
  // ** States
  const [locale, setLocale] = useState(initLang);
  const [messages, setMessages] = useState(menuMessages[initLang]);

  // ** Switches Language
  const switchLanguage = (language) => {
    setLocale(language);
    setMessages(menuMessages[language]);
    localStorage.setItem('language', language);
  };

  return (
    <Context.Provider value={{ locale, switchLanguage }}>
      <IntlProvider key={locale} locale={locale} messages={messages} defaultLocale="en">
        {children}
      </IntlProvider>
    </Context.Provider>
  );
};

export { IntlProviderWrapper, Context as IntlContext };
