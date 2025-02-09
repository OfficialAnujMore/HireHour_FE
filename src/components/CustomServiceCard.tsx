import React, {useState} from 'react';
import {View, StyleSheet, Image, TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {CustomRatingInfo} from './CustomRatingInfo';
import {COLORS} from '../utils/globalConstants/color';
import {FontSize, Screen, Spacing} from '../utils/dimension';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importing MaterialIcons for icons
import {
  CustomCardsProps,
  ScheduleItem,
  ServiceDetails,
  TimeSlot,
} from 'interfaces';
import CustomText from './CustomText';
import {removeServiceFromCart} from '../redux/cartSlice';
import {useDispatch} from 'react-redux';

// Type definition for the component props
interface CustomServiceCardsProps {
  item: CustomCardsProps;
  handlePress: (id: string) => void;
}

// Component for rendering schedule details
export const ScheduleDetails: React.FC<{
  schedule: ScheduleItem[];
  serviceId?: string;
  visibleSchedules?: Record<string, boolean>;
  onServiceSelect: (service: ServiceDetails) => void;
  selectedServices: ServiceDetails[];
}> = ({
  schedule,
  serviceId,
  visibleSchedules,
  onServiceSelect,
  selectedServices,
  handleRemoveScheduledDate,
}) => {
  const displayedSchedules = schedule.slice(0, 5);
  const dispatch = useDispatch();
  const isSelected = (service: ServiceDetails) =>
    selectedServices?.some(s => s.id === service.id);

  return (
    <View style={styles.scheduleContainer}>
      {schedule.map(scheduleItem => (
        <TouchableOpacity
          key={scheduleItem.id}
          onPress={() => onServiceSelect(scheduleItem)}
          style={[
            styles.scheduleItemContainer,
            isSelected(scheduleItem) && styles.selectedSchedule,
          ]}>
          <CustomText style={styles.scheduleTitle} label={scheduleItem.date} />
          {handleRemoveScheduledDate && (
            <TouchableOpacity
              onPress={() => {
                if (schedule.length == 1) {
                  dispatch(removeServiceFromCart(serviceId));
                }
                handleRemoveScheduledDate(serviceId, scheduleItem.id);
              }}>
              <Icon name="delete" size={FontSize.medium} color={COLORS.red} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      ))}

      {displayedSchedules.length > 4 && (
        <CustomText
          style={styles.moreText}
          label={'View more'}
          action={() => {
            console.log('View more clicked');
          }}
        />
      )}
    </View>
  );
};

const CustomServiceCards: React.FC<CustomServiceCardsProps> = ({
  item,
  handleRemoveService,
  handleRemoveScheduledDate,
  handlePress,
}) => {
  const navigation = useNavigation();
  const [visibleSchedules, setVisibleSchedules] = useState<
    Record<string, boolean>
  >({});
  const toggleScheduleVisibility = (serviceId: string) => {
    setVisibleSchedules(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  return (
    <TouchableOpacity
      key={item.serviceId}
      style={styles.container}
      onPress={() => {
        navigation.navigate('Service Details', item);
      }}>
      <View style={styles.serviceContainer}>
        <View style={styles.detailsContainer}>
          <Image
            source={{
              uri:
                item.servicePreview[0]?.imageUri ||
                'https://via.placeholder.com/60',
            }}
            style={styles.orderImage}
          />
          <View style={styles.orderDetails}>
            <CustomText style={styles.orderTitle} label={item.title} />
            <CustomText
              style={styles.orderMeta}
              label={` ${item.ratings} ★ | ${item.chargesPerHour}/hr`}
            />

            <CustomText style={styles.orderMeta} label={item.description} />
          </View>
        </View>
        {handleRemoveService ? (
          <TouchableOpacity
            onPress={() => {
              handleRemoveService(item.serviceId);
            }}>
            <Icon name="delete" size={FontSize.medium} color={COLORS.red} />
          </TouchableOpacity>
        ) : (
          <CustomText
            label={
              visibleSchedules[item.serviceId]
                ? 'Hide Schedule'
                : 'View Schedule'
            }
            action={() => toggleScheduleVisibility(item.serviceId)}
            style={styles.viewScheduleText}
          />
        )}
      </View>
      <ScheduleDetails
        schedule={item.schedule}
        serviceId={item.serviceId}
        visibleSchedules={visibleSchedules}
        handleRemoveScheduledDate={handleRemoveScheduledDate}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: Spacing.small,
    marginVertical: Spacing.small,
    padding: Spacing.small,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    justifyContent: 'space-between',
  },
  serviceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: Screen.width * 0.25,
    height: Screen.width * 0.25,
    borderRadius: Spacing.small,
  },

  orderImage: {
    width: Screen.moderateScale(60),
    height: Screen.moderateScale(60),
    borderRadius: Screen.moderateScale(8),
  },
  detailsContainer: {
    flexDirection: 'row',
  },
  orderDetails: {
    marginHorizontal: Spacing.medium,
  },
  orderTitle: {
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    color: '#333',
  },
  orderMeta: {
    fontSize: FontSize.small,
    color: '#666',
  },
  viewScheduleText: {
    fontSize: FontSize.small,
    color: COLORS.primary,
  },
  scheduleItemContainer: {
    backgroundColor: COLORS.primary, // Background color from your COLORS object
    borderRadius: Screen.moderateScale(8), // Rounded corners
    padding: Spacing.small, // Ensure padding inside container
  },
  scheduleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.small,
  },
  scheduleTitle: {
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  scheduleTimeSlot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.small,
  },
  scheduleTime: {
    fontSize: FontSize.small,
    color: '#666',
  },
  availability: {
    fontSize: FontSize.small,
    color: '#03A9F4',
  },
  moreButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    marginTop: 10,
  },
  moreText: {
    color: '#03A9F4',
    fontSize: 14,
  },

  selectedSchedule: {
    backgroundColor: COLORS.red,
  },
});

export default CustomServiceCards;
