import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import CustomText from '../components/CustomText';
import {getUpcomingEvents} from '../services/serviceProviderService';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from 'redux/store';
import {useFocusEffect} from '@react-navigation/native';
import {WORD_DIR} from '../utils/local/en';
import {FallBack} from '../components/FallBack';
import dataNotFound from '../assets/error-in-calendar.png';
import {globalStyle} from '../utils/globalStyle';
import {ApiResponse} from 'services/apiClient';
import {ErrorResponse, ServiceDetails} from 'interfaces';
import {showSnackbar} from '../redux/snackbarSlice';
import {FontSize, Screen, Spacing} from '../utils/dimension';
import { formatDateUS } from '../utils/globalFunctions';

const UpcomingEvents = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [data, setData] = useState<ServiceDetails[]>([]);
  const dispatch = useDispatch();

  const apiCall = async (): Promise<void> => {
    const response: ApiResponse<ServiceDetails[]> | ErrorResponse =
      await getUpcomingEvents({userId: user?.id});
    if (response.success && response.data) {
      setData(response.data);
    } else {
      dispatch(
        showSnackbar({
          message: response.message,
          success: false,
        }),
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      apiCall();
    }, []),
  );

  const renderScheduleCard = useCallback(({item}: {item: ServiceDetails}) => {
    console.log(item);
    
    const {services, date} = item;
    const {user, servicePreview} = services;

    const formattedDate = formatDateUS(date)
    return (
      <View style={styles.card}>
        <Image
          source={{
            uri: servicePreview?.[0]?.uri || '',
          }}
          style={styles.image}
        />
        <View style={styles.content}>
          <CustomText
            label={services?.title || 'No Title'}
            style={styles.title}
            numberOfLines={2}
          />
          <CustomText
            label={services?.description || 'No Description'}
            style={styles.description}
            numberOfLines={4}
          />
          <CustomText
            label={`Scheduled Date: ${formattedDate}`}
            style={styles.date}
          />

          <View style={styles.userInfo}>
            <CustomText label="Artist details:" style={styles.userTitle} />
            <CustomText
              label={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`}
            />
            <CustomText label={user?.email ?? ''} />
            <CustomText label={user?.phoneNumber ?? ''} />
          </View>
        </View>
      </View>
    );
  }, []);

  return (
    <View style={globalStyle.globalContainer}>
      {data && data.length === 0 ? (
        <FallBack
          imageSrc={dataNotFound}
          heading={WORD_DIR.noUpcomingEvents}
          subHeading={WORD_DIR.scheduleEvent}
        />
      ) : (
        <View>
          <CustomText label={WORD_DIR.upcomingEvents} />
          <FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={renderScheduleCard}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
};

export default UpcomingEvents;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginBottom: Spacing.small,
    borderRadius: Spacing.small,
    overflow: 'hidden',
    elevation: 4,
  },
  image: {
    width: '100%',
    height: Screen.height / 4,
  },
  content: {
    padding: Spacing.small,
  },
  title: {
    fontSize: FontSize.small + 2,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    marginBottom: Spacing.small,
    color: '#555',
  },
  date: {
    marginBottom: 8,
    fontStyle: 'italic',
  },
  userInfo: {
    marginBottom: 12,
  },
  userTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
