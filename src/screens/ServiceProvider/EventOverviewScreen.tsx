import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
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
import CustomText from '../../components/CustomText';
import {FontSize, Screen, Spacing} from '../../utils/dimension';
import {COLORS} from '../../utils/globalConstants/color';
import { formatDateUS } from '../../utils/globalFunctions';

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

const EventOverviewScreen = ({route}) => {
  const {type} = route.params;
  const user = useSelector((state: RootState) => state.auth.user);
  const [bookedSchedules, setBookedSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  const fetchService = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMyBookedServices({
        id: user.id,
        type,
      });

      console.log(response);

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
    const data: Schedule = {...item, isApproved};
    const response = await handleSlotApproval(data);

    if (response.success) {
      dispatch(
        showSnackbar({
          message: isApproved
            ? 'Slot approved successfully'
            : 'Slot rejected successfully',
          success: isApproved,
        }),
      );
      setBookedSchedules(prev =>
        prev.filter(schedule => schedule.id !== item.id),
      );
    } else {
      dispatch(
        showSnackbar({message: 'Failed to update slot', success: false}),
      );
    }
  };

  const renderScheduleCard = useCallback(
    ({item}: {item: Schedule}) => {
      const {services, bookedUser, date} = item;
      const showActions = type === 'Booked';
      const formatedDate = formatDateUS(date);

      return (
        <View style={styles.card}>
          <Image
            source={{uri: services.servicePreview?.[0]?.uri || ''}}
            style={styles.image}
          />
          <View style={styles.content}>
            <CustomText
              label={services.title}
              style={styles.title}
              numberOfLines={2}
            />
            <CustomText
              label={services.description}
              style={styles.description}
              numberOfLines={2}
            />
            <CustomText label={`Scheduled Date: ${formatedDate}`} style={styles.date} />

            <View style={styles.userInfo}>
              <CustomText label="Booked By:" style={styles.userTitle} />
              <CustomText
                label={`${bookedUser.firstName} ${bookedUser.lastName}`}
              />
              <CustomText label={bookedUser.email} />
              <CustomText label={bookedUser.phoneNumber} />
            </View>

            {showActions && (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.button, {backgroundColor: COLORS.success}]}
                  onPress={() => onApproveOrRejection(item, true)}>
                  <CustomText label="Approve" style={styles.buttonText} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, {backgroundColor: COLORS.error}]}
                  onPress={() => onApproveOrRejection(item, false)}>
                  <CustomText label="Reject" style={styles.buttonText} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      );
    },
    [type, onApproveOrRejection],
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
       <CustomText
              label={`${type} Events`}
              style={styles.title}
              numberOfLines={2}
            />
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
          heading="No schedules found for this category."
        />
      )}
    </View>
  );
};

export default EventOverviewScreen;

const styles = StyleSheet.create({
  container: {padding: Spacing.small},
  loaderContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  card: {
    backgroundColor: '#fff',
    marginBottom: Spacing.small,
    borderRadius: Spacing.small,
    overflow: 'hidden',
    elevation: 4,
  },
  image: {width: '100%', height: Screen.height / 4},
  content: {padding: Spacing.small},
  title: {fontSize: FontSize.small + 2, fontWeight: 'bold', marginBottom: 4},
  description: {marginBottom: Spacing.small, color: '#555'},
  date: {marginBottom: 8, fontStyle: 'italic'},
  userInfo: {marginBottom: 12},
  userTitle: {fontWeight: 'bold', marginBottom: 4},
  actions: {flexDirection: 'row', justifyContent: 'space-between'},
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
});
