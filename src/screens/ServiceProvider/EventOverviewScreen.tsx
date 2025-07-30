import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {
  getMyBookedServices,
  handleSlotApproval,
} from '../../services/serviceProviderService';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {ServiceDetails, User} from 'interfaces';
import {showSnackbar} from '../../redux/snackbarSlice';
import {FallBack} from '../../components/FallBack';
import CustomText from '../../components/CustomText';
import {FontSize, Spacing} from '../../utils/dimension';
import {COLORS} from '../../utils/globalConstants/color';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'interfaces';
import {WORD_DIR} from '../../utils/local/en';
import {apiWithLoader} from '../../utils/apiWithLoader';
import {getErrorMessage} from '../../utils/errorHandler';
import EventCard from '../../components/EventCard';
import EventHeader from '../../components/EventHeader';

interface Schedule {
  id: string;
  date: string;
  isAvailable: boolean;
  servicesId: string;
  bookedUserId: string;
  isApproved: boolean;
  holdExpiresAt: string | null;
  bookedUser: User;
  services: ServiceDetails;
}

const EventOverviewScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'BookedEvents' | 'UpcomingEvents' | 'PastEvents'>>();
  const {type} = route.params;
  const user = useSelector((state: RootState) => state.auth.user);
  const [bookedSchedules, setBookedSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  const fetchService = useCallback(async () => {
    setLoading(true);
    try {
      if (!user?.id) {
        console.error('User ID not available');
        return;
      }
      
      const response = await apiWithLoader(
        () => getMyBookedServices({
          id: user.id,
          type,
        }),
        'Loading events...'
      );

      setBookedSchedules(response.data);
    } catch (error) {
      console.error('Error fetching booked services:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, type]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  const onApproveOrRejection = async (item: Schedule, isApproved: boolean) => {
    const data = {...item, isApproved} as Record<string, unknown>;
    const response = await apiWithLoader(
      () => handleSlotApproval(data),
      isApproved ? 'Approving slot...' : 'Rejecting slot...'
    );

    if (response.success) {
      dispatch(
        showSnackbar({
          message: isApproved
            ? WORD_DIR.slotApprovedSuccessfully
            : WORD_DIR.slotRejectedSuccessfully,
          success: isApproved,
        }),
      );
      setBookedSchedules(prev =>
        prev.filter(schedule => schedule.id !== item.id),
      );
    } else {
      dispatch(
        showSnackbar({message: getErrorMessage(response, WORD_DIR.failedToUpdateSlot), success: false}),
      );
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'Booked':
        return 'schedule';
      case 'Upcoming':
        return 'event';
      case 'Past':
        return 'history';
      default:
        return 'event';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'Booked':
        return COLORS.primary;
      case 'Upcoming':
        return COLORS.success;
      case 'Past':
        return COLORS.gray;
      default:
        return COLORS.primary;
    }
  };

  const renderScheduleCard = useCallback(
    ({item}: {item: Schedule}) => {
      const {services, bookedUser, date} = item;      
      const showActions = type === 'Booked';

      return (
        <EventCard
          service={services}
          user={bookedUser}
          date={date}
          showActions={showActions}
          onApprove={() => onApproveOrRejection(item, true)}
          onReject={() => onApproveOrRejection(item, false)}
          showPrice={true}
          showCategory={true}
          showDescription={true}
          showDate={true}
          showUserInfo={true}
          userLabel={WORD_DIR.bookedBy}
        />
      );
    },
    [type, onApproveOrRejection],
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <CustomText
          label="Loading events..."
          style={styles.loaderText}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* Header Section */}
      <EventHeader
        title={`${type} Events`}
        count={bookedSchedules.length}
        icon={getTypeIcon()}
        color={getTypeColor()}
      />

      {/* Content */}
      {bookedSchedules.length > 0 ? (
        <FlatList
          data={bookedSchedules}
          renderItem={renderScheduleCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <FallBack
            imageSrc={require('../../assets/error-in-calendar.png')}
            heading={WORD_DIR.noSchedulesFound}
          />
        </View>
      )}
    </View>
  );
};

export default EventOverviewScreen;

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
