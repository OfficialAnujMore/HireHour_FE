import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onNotification: function (notification) {
    console.log('Notification:', notification);
    notification.finish(PushNotification.FetchResult.NoData);
  },
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },
  onAction: function (notification) {
    console.log('Action:', notification);
  },
  onRegistration: function (token) {
    console.log('FCM Token:', token);
  },
  popInitialNotification: true,
  requestPermissions: Platform.OS === 'ios',
});
