import { useContext, useEffect, useState } from 'react';
// @mui
import { Badge, Box, Divider, Tooltip, Typography } from '@mui/material';
// utils
// components
import { getErrorMessage } from '@api/handleApiError';
import {
  getAllUnreadNotificationCountAPI,
  getNotificationsAPI,
  updateNotificationAsReadAPI,
  updateNotificationReadAllAPI,
} from '@api/main';
import { IconButtonAnimate } from '@components/animate';
import Iconify from '@components/iconify/Iconify';
import MenuPopover from '@components/MenuPopover';
import NotiItem from '@components/NotiListing/NotiItem';
import { IntlContext } from '@utilities/context/Internationalization';
import { SignalR } from '@utilities/context/SignalRContext';
import { useSnackbar } from 'notistack';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

const pageSize = 10;

export default function NotificationsPopover() {
  const [notifications, setNotifications] = useState([]);
  const [countOfUnread, setCountOfUnread] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  // hooks
  const { enqueueSnackbar } = useSnackbar();
  const intlContext = useContext(IntlContext);
  const intl = useIntl();
  const signalR = useContext(SignalR);
  const { isUserLoggedIn } = useSelector((state) => state.auth);

  const fetchNotifications = async (pageSize, pageNumber) => {
    try {
      const res = await getNotificationsAPI(pageSize, pageNumber, 'vi');
      const count = await getAllUnreadNotificationCountAPI();
      setNotifications(res.data.pageData);
      const paging = res.data.paging;
      const totalCurrentItem = paging.pageSize * paging.pageNumber;
      setHasMore(paging.totalItem - totalCurrentItem > 0);
      setPageNumber(paging.totalItem - totalCurrentItem > 0 ? 2 : 1);
      setCountOfUnread(count.data.count);
    } catch (error) {
      enqueueSnackbar(<FormattedMessage id={getErrorMessage(error)} defaultMessage={getErrorMessage(error)} />, {
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    if (isUserLoggedIn) {
      fetchNotifications(pageSize, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToggle, isUserLoggedIn]);

  signalR.on('ReceiveMessage', (message) => {
    setRefreshToggle(!refreshToggle);
  });

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  // handle load more
  const loadMore = async () => {
    try {
      const res = await getNotificationsAPI(pageSize, pageNumber, intlContext.locale);
      setTimeout(() => {
        setNotifications([...notifications, ...res.data.pageData]);
      }, 500);
      const paging = res.data.paging;
      const totalCurrentItem = paging.pageSize * paging.pageNumber;
      const remainingItem = paging.totalItem - totalCurrentItem;
      if (remainingItem > 0) {
        setPageNumber(pageNumber + 1);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      enqueueSnackbar(<FormattedMessage id={getErrorMessage(error)} defaultMessage={getErrorMessage(error)} />, {
        variant: 'error',
      });
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await updateNotificationAsReadAPI(notificationId);
      setCountOfUnread(countOfUnread - 1);
      setRefreshToggle(!refreshToggle);
    } catch (error) {
      enqueueSnackbar(<FormattedMessage id={getErrorMessage(error)} defaultMessage={getErrorMessage(error)} />, {
        variant: 'error',
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await updateNotificationReadAllAPI();
      setRefreshToggle(!refreshToggle);
    } catch (error) {
      enqueueSnackbar(<FormattedMessage id={getErrorMessage(error)} defaultMessage={getErrorMessage(error)} />, {
        variant: 'error',
      });
    }
  };

  return (
    <>
      <IconButtonAnimate color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        <Badge badgeContent={countOfUnread < 10 ? countOfUnread : '9+'} color="error">
          <Iconify icon="eva:bell-fill" width={20} height={20} />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">
              <FormattedMessage id="label.notifications" defaultMessage="Notifications" />
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {intl.formatMessage({ id: 'notification.unreadMessageCount' }, { count: countOfUnread })}
            </Typography>
          </Box>

          {countOfUnread > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButtonAnimate color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" width={20} height={20} />
              </IconButtonAnimate>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <InfiniteScroll dataLength={notifications.length} next={loadMore} hasMore={hasMore} height={400}>
          {notifications.map((notification, index) => (
            <NotiItem key={index} notification={notification} handleMarkANotiAsRead={handleMarkAsRead} />
          ))}
        </InfiniteScroll>
      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------
