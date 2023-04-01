import enLocale from 'date-fns/locale/en-US';
import viLocale from 'date-fns/locale/vi';
// @mui
import { Typography, ListItemText, ListItemButton } from '@mui/material';
// utils
import { fToNow } from '@utilities/formatTime';
// components
import Iconify from '@components/iconify/Iconify';
import { IntlContext } from 'react-intl';
import { useContext } from 'react';

// ----------------------------------------------------------------------

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.body}
      </Typography>
    </Typography>
  );

  return {
    avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
    title,
  };
}

const NotiItem = ({ notification, handleMarkANotiAsRead }) => {
  const { title } = renderContent(notification);
  const intlContext = useContext(IntlContext);

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(!notification.isRead && {
          bgcolor: 'action.selected',
        }),
      }}
      onClick={() => {
        if (!notification.isRead) {
          handleMarkANotiAsRead(notification.notificationId);
        }
      }}
    >
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {!!notification.actualSentAtUnix &&
              fToNow(notification.actualSentAtUnix, intlContext.locale === 'vi' ? viLocale : enLocale)}
          </Typography>
        }
      />
    </ListItemButton>
  );
};

export default NotiItem;
