import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onNotification: function (notification) {
    notification.finish(PushNotification.FetchResult.NoData);
  },
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },
  onAction: function (notification) {},
  onRegistration: function (token) {
    
  },
  popInitialNotification: true,
  requestPermissions: Platform.OS === 'ios',
});
