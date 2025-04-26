import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  getMyBookedServices,
  handleSlotApproval,
} from '../../services/serviceProviderService';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {ServiceDetails, User} from 'interfaces';
import {showSnackbar} from '../../redux/snackbarSlice';
import {globalStyle} from '../../utils/globalStyle';
import {FallBack} from '../../components/FallBack';

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

const BookedSchedulesScreen = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [bookedSchedules, setBookedSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  // Fetch service data when the component mounts
  const fetchService = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMyBookedServices({
        id: user?.id,
        isAvailable: false,
      });
      if (response.success && response.data) {
        setBookedSchedules(response.data);
      }
    } catch (error) {
      console.error('Error fetching booked services:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  // Handle approve/rejection actions
  const onApproveOrRejection = async (item: Schedule, isApproved: boolean) => {
    const data: Schedule = {...item, isApproved};

    const response = await handleSlotApproval(data);
    if (response.success) {
      dispatch(
        showSnackbar({
          message: isApproved
            ? 'Slot approved successfully'
            : 'Slot rejected successfully',
          success: true,
        }),
      );
    } else {
      dispatch(
        showSnackbar({
          message: 'Failed to update slot',
          success: false,
        }),
      );
    }
  };

  // Memoize rendering of schedule cards to optimize performance
  const renderScheduleCard = useCallback(
    ({item}: {item: Schedule}) => {
      const {services, bookedUser, date} = item;

      return (
        <View style={styles.card}>
          <Image
            source={{
              uri: services.servicePreview?.[0]?.uri || '',
            }}
            style={styles.image}
          />
          <View style={styles.content}>
            <Text style={styles.title}>{services.title}</Text>
            <Text style={styles.description}>{services.description}</Text>
            <Text style={styles.date}>Scheduled Date: {date}</Text>

            <View style={styles.userInfo}>
              <Text style={styles.userTitle}>Booked By:</Text>
              <Text>
                {bookedUser.firstName} {bookedUser.lastName}
              </Text>
              <Text>{bookedUser.email}</Text>
              <Text>{bookedUser.phoneNumber}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, {backgroundColor: 'green'}]}
                onPress={() => onApproveOrRejection(item, true)}>
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, {backgroundColor: 'red'}]}
                onPress={() => onApproveOrRejection(item, false)}>
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    },
    [onApproveOrRejection],
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={globalStyle.globalContainer}>
      {bookedSchedules.length > 0 ? (
        <FlatList
          data={bookedSchedules}
          renderItem={renderScheduleCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.container}
        />
      ) : (
        <FallBack
          imageSrc={require('../../assets/error-in-calendar.png')}
          heading="Kindly create a service first before continuing!"
        />
      )}
    </View>
  );
};

export default BookedSchedulesScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    marginBottom: 8,
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
