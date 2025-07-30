import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import CustomText from '../components/CustomText';
import {getUpcomingEvents} from '../services/serviceProviderService';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from 'redux/store';
import {useFocusEffect} from '@react-navigation/native';
import {WORD_DIR} from '../utils/local/en';
import {FallBack} from '../components/FallBack';
import dataNotFound from '../assets/error-in-calendar.png';
import {ApiResponse} from 'services/apiClient';
import {ErrorResponse, ServiceDetails} from 'interfaces';
import {showSnackbar} from '../redux/snackbarSlice';
import {FontSize, Spacing} from '../utils/dimension';
import {COLORS} from '../utils/globalConstants/color';
import {apiWithLoader} from '../utils/apiWithLoader';
import {getErrorMessage} from '../utils/errorHandler';
import EventCard from '../components/EventCard';
import EventHeader from '../components/EventHeader';

interface UpcomingEventItem {
  id: string;
  services: ServiceDetails;
  date: string;
}

const UpcomingEvents: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [data, setData] = useState<UpcomingEventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  const apiCall = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      if (!user?.id) {
        console.error('User ID not available');
        return;
      }

      const response: ApiResponse<ServiceDetails[]> | ErrorResponse = await apiWithLoader(
        () => getUpcomingEvents({userId: user.id}),
        'Loading upcoming events...'
      );
      if (response.success && response.data) {
        setData(response.data as any);
      } else {
        dispatch(
          showSnackbar({
            message: getErrorMessage(response, 'Failed to load upcoming events. Please try again.'),
            success: false,
          }),
        );
      }
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, dispatch]);

  useFocusEffect(
    useCallback(() => {
      apiCall();
    }, [apiCall]),
  );

  const renderScheduleCard = useCallback(({item}: {item: UpcomingEventItem}) => {
    const {services, date} = item;
    const user = (services as any).user;

    return (
      <EventCard
        service={services}
        user={user}
        date={date}
        showActions={false}
        showPrice={true}
        showCategory={true}
        showDescription={true}
        showDate={true}
        showUserInfo={true}
        userLabel={WORD_DIR.artistDetails}
      />
    );
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <CustomText
          label="Loading upcoming events..."
          style={styles.loaderText}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Header Section */}
      <EventHeader
        title={WORD_DIR.upcomingEvents}
        count={data.length}
        icon="event"
        color={COLORS.success}
      />

      {/* Content */}
      {data && data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={item => item.id || ''}
          renderItem={renderScheduleCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <FallBack
            imageSrc={dataNotFound}
            heading={WORD_DIR.noUpcomingEvents}
            subHeading={WORD_DIR.scheduleEvent}
          />
        </View>
      )}
    </View>
  );
};

export default UpcomingEvents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  loaderText: {
    marginTop: Spacing.medium,
    fontSize: FontSize.medium,
    color: COLORS.gray,
  },
  listContainer: {
    padding: Spacing.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
