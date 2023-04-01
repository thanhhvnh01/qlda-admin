import { HttpTransportType, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Storage, STORAGE_KEYS } from '@utilities/storage';
import { createContext, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
export const SignalR = createContext();

export const SignalRContext = ({ children }) => {
  const { isUserLoggedIn, refreshToken, userData } = useSelector((state) => state.auth);
  const connection = useMemo(() => {
    const currentToken = Storage.getItem(STORAGE_KEYS.token);
    return new HubConnectionBuilder()
      .withUrl(`${process.env.REACT_APP_API_URL}/notifyhub?userId=${userData?.userId}`, {
        accessTokenFactory: () => currentToken?.accessToken,
        withCredentials: false,
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Information)
      .build();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, refreshToken]);

  const connectSignalR = async () => {
    await connection
      .start({ withCredentials: false })
      .then(() => {
        console.log('connection success!!!');
      })
      .catch(function (err) {
        return console.error('>>error', err);
      });
  };

  useEffect(() => {
    if (!!isUserLoggedIn) {
      connectSignalR();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserLoggedIn, connection, refreshToken]);

  return <SignalR.Provider value={connection}>{children}</SignalR.Provider>;
};
