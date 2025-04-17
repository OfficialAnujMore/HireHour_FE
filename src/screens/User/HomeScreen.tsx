import React, {useState, useCallback, useEffect} from 'react';
import {View, FlatList, StyleSheet, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import CustomSearchBar from '../../components/CustomSearchBar';
import CustomText from '../../components/CustomText';
import {FontSize, Screen, Spacing} from '../../utils/dimension';
import {getGreeting} from '../../utils/globalFunctions';
import {getServiceProviders} from '../../services/serviceProviderService';
import {useFocusEffect} from '@react-navigation/native';
import {ErrorResponse, ServiceDetails, User} from 'interfaces';
import CustomServiceCards from '../../components/CustomServiceCard';
import {FallBack} from '../../components/FallBack';
import dataNotFound from '../../assets/error-in-calendar.png';
import {WORD_DIR} from '../../utils/local/en';
import {MAX_SCHEDULE_DISPLAY} from '../../utils/constants';
import {showSnackbar} from '../../redux/snackbarSlice';
import {ApiResponse} from '../../services/apiClient';
import { COLORS } from '../../utils/globalConstants/color';
import { globalStyle } from '../../utils/globalStyle';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  PermissionStatus,
} from 'react-native-permissions';
import PushNotification from 'react-native-push-notification';
import { upsertFCMToken } from '../../services/userService';
import { login } from '../../redux/authSlice';

const HomeScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [data, setData] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);

  const fetchServiceProviders = useCallback(async (): Promise<void> => {
    const categories = ['Photography', 'Guitar', 'Art', 'Music', 'Sports'];
    const response: ApiResponse<ServiceDetails[]> | ErrorResponse =
      await getServiceProviders(user?.id, categories);

    if (response.success && response.data) {
      setData(response.data);
      setFilteredData(response.data); // Set filtered data as the default
    } else {
      dispatch(
        showSnackbar({
          message: response.message,
        }),
      );
    }
    askNotificationPermission();
  }, [user?.id]);

  // Use `useFocusEffect` to call the API whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchServiceProviders();
    }, [fetchServiceProviders]),
  );

  // Search handler
  const handleSearch = (query: string) => {
    if (query) {
      const filtered = data.filter(
        item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data); // Reset filtered data to the full data if no query
    }
  };

  const getFCMToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      const res = await upsertFCMToken({
        userId: user?.id,
        token:fcmToken
      })
      dispatch(login({user: res.data}));
    }
  };
  
  const askNotificationPermission = async (): Promise<PermissionStatus> => {
    let permission: typeof PERMISSIONS[keyof typeof PERMISSIONS] | null = null;
  
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
      if (enabled) {
        // console.log('iOS notification permission granted');
        getFCMToken(); // Call it after permission is granted
        return RESULTS.GRANTED;
      } else {
        console.warn('iOS notification permission denied');
        return RESULTS.DENIED;
      }
    } else if (Platform.OS === 'android' && Platform.Version >= 33) {
      permission = 'android.permission.POST_NOTIFICATIONS';
    }
  
    if (!permission) {
      // console.log('Android permission granted by default');
      getFCMToken(); // Call it for Android if no specific permission is required
      return RESULTS.GRANTED;
    }
  
    const result = await check(permission);
  
    if (result === RESULTS.GRANTED) {
      console.log('Notification permission already granted');
      getFCMToken(); // Call it after permission check
      return result;
    }
  
    const newStatus = await request(permission);
  
    if (newStatus === RESULTS.GRANTED) {
      console.log('Notification permission granted');
      getFCMToken(); // Call it after permission granted
    } else {
      console.warn('Notification permission denied or blocked');
    }
  
    return newStatus;
  };

  
  
  const createNotificationChannel = () => {
    if (Platform.OS === 'android' && Platform.Version >= 26) {
      PushNotification.createChannel(
        {
          channelId: 'default-channel', // Channel ID (unique)
          channelName: 'Default Channel', // Channel Name (can be anything)
          channelDescription: 'A default channel for notifications', // Channel Description
          soundName: 'default', // Sound for notifications
          importance: 4, // Importance level (4 is high importance)
          vibrate: true, // Vibration for notifications
        },
        (created:any) => console.log(`Create channel returned ${created}`)
      );
    }
  };


  useEffect(() => {
    // Request user permission for notifications (iOS only)
    // if (Platform.OS === 'ios') {
    //   messaging().requestPermission();
    // }
    // Create notification channel for Android
    createNotificationChannel();
    // Foreground message handler
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.notification) {
        PushNotification.localNotification({
          channelId: 'default-channel', // Use the channel ID here
          title: remoteMessage.notification.title,
          message: remoteMessage.notification.body,
        });
      } else {
        console.log('No notification data found in remote message');
      }
    });
  
    return unsubscribe;
  }, []);
  

  return (
    <View style={globalStyle.globalContainer}>
      <CustomSearchBar onSearch={handleSearch} />
      <CustomText
        label={`${getGreeting()}, ${user?.firstName}`}
        style={styles.greetingText}
      />

      {filteredData?.length > 0 ? (
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <CustomServiceCards
              item={item}
              maxDisplay={MAX_SCHEDULE_DISPLAY}
              handlePress={() => {
                navigation.navigate('ServiceDetails', item);
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FallBack imageSrc={dataNotFound} heading={WORD_DIR.noService} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  greetingText: {
    fontSize: FontSize.large,
    fontWeight: '600',
  },
  dataNotFound: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: FontSize.large,
    fontWeight: '600',
  },
});

export default HomeScreen;
