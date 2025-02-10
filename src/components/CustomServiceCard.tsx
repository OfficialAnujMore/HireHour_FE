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
  maxDisplay: number;
  serviceId?: string;
  visibleSchedules?: Record<string, boolean>;
  onServiceSelect: (service: ServiceDetails) => void;
  selectedServices: ServiceDetails[];
  handleRemoveScheduledDate?: (
    serviceId: string | undefined,
    scheduleId: string,
  ) => void;
}> = ({
  schedule,
  maxDisplay,
  serviceId,
  onServiceSelect,
  selectedServices,
  handleRemoveScheduledDate,
}) => {
  const [showAll, setShowAll] = useState(false);

  const displayedSchedules = showAll ? schedule : schedule.slice(0, maxDisplay);
  const dispatch = useDispatch();
  const isSelected = (service: ServiceDetails) =>
    selectedServices?.some(s => s.id === service.id);

  return (
    <View style={styles.scheduleContainer}>
      {displayedSchedules.map(scheduleItem => (
        <TouchableOpacity
          key={scheduleItem.id}
          onPress={() => onServiceSelect(scheduleItem)}
          style={[
            styles.scheduleItemContainer,
            isSelected(scheduleItem) && styles.selectedSchedule,
          ]}>
          <CustomText
            style={[
              styles.scheduleTitle,
              isSelected(scheduleItem) && styles.selectedTextColor,
            ]}
            label={scheduleItem.date}
          />
          {handleRemoveScheduledDate && (
            <TouchableOpacity
              onPress={() => {
                if (schedule.length === 1) {
                  dispatch(removeServiceFromCart(serviceId));
                }
                handleRemoveScheduledDate(serviceId, scheduleItem.id);
              }}>
              <Icon name="delete" size={FontSize.medium} color={COLORS.red} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      ))}

      {schedule.length > maxDisplay && (
        <CustomText
          style={styles.moreText}
          label={showAll ? 'View less' : 'View more'}
          action={() => setShowAll(prev => !prev)}
        />
      )}
    </View>
  );
};

const CustomServiceCards: React.FC<CustomServiceCardsProps> = ({
  item,
  maxDisplay,
  handleRemoveService,
  handleRemoveScheduledDate,
  handlePress,
}) => {
  const navigation = useNavigation();
  const [visibleSchedules, setVisibleSchedules] = useState<
    Record<string, boolean>
  >({});

  // Toggle schedule visibility based on serviceId
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

      {/* Conditionally render ScheduleDetails based on visibility state */}
      {(visibleSchedules[item.serviceId] || handleRemoveService)  && (
        <ScheduleDetails
          schedule={item.schedule}
          maxDisplay={maxDisplay}
          serviceId={item.serviceId}
          handleRemoveScheduledDate={handleRemoveScheduledDate}
          onServiceSelect={() => {}}
          selectedServices={[]}
        />
      )}

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
    backgroundColor: COLORS.white, // Background color from your COLORS object
    borderRadius: Screen.moderateScale(8), // Rounded corners
    padding: Spacing.small,
    borderWidth: 0.5,
    borderColor: COLORS.primary,
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
    color: COLORS.primary,
  },
  moreText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  selectedSchedule: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.white,
  },
  selectedTextColor: {
    color: COLORS.white,
  },
});

export default CustomServiceCards;
