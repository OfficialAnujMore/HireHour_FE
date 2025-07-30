import React, {useState} from 'react';
import {View, StyleSheet, Image, TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'interfaces';
import {CustomRatingInfo} from './CustomRatingInfo';
import {COLORS} from '../utils/globalConstants/color';
import {FontSize, Screen, Spacing} from '../utils/dimension';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {CustomCardsProps, ScheduleItem, ServiceDetails} from 'interfaces';
import CustomText from './CustomText';
import {removeServiceFromCart} from '../redux/cartSlice';
import {useDispatch} from 'react-redux';
import {SCHEDULE} from '../utils/constants';
import {formatDateUS} from '../utils/dateUtils';

// Type definition for the component props
interface CustomServiceCardsProps {
  item: ServiceDetails | any;
  handleRemoveService?: (serviceId: string) => void;
  handleRemoveScheduledDate?: (
    serviceId: string | undefined,
    scheduleId: string,
  ) => void;
  setApprovedSlot?: () => void;
}

// Component for rendering schedule details
export const ScheduleDetails: React.FC<{
  schedule: ScheduleItem[];
  maxDisplay: number;
  serviceId?: string;
  visibleSchedules?: Record<string, boolean>;
  onServiceSelect: (service: ScheduleItem) => void;
  selectedServices: ScheduleItem[];
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
  const isSelected = (service: ScheduleItem) =>
    selectedServices?.some(s => s.id === service.id);

  return (
    <View style={styles.scheduleContainer}>
      <CustomText style={styles.scheduleSectionTitle} label="Selected Dates" />
      <View style={styles.scheduleItemsWrapper}>
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
              label={formatDateUS(scheduleItem.date)}
            />
            {handleRemoveScheduledDate && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => {
                  if (schedule.length === 1 && serviceId) {
                    dispatch(removeServiceFromCart(serviceId));
                  }
                  if (serviceId) {
                    handleRemoveScheduledDate(serviceId, scheduleItem.id);
                  }
                }}>
                <Icon name="close" size={FontSize.small} color={COLORS.error} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {schedule.length > maxDisplay && (
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => setShowAll(prev => !prev)}>
          <CustomText
            style={styles.moreText}
            label={
              showAll
                ? 'View less'
                : `View ${schedule.length - maxDisplay} more`
            }
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const CustomServiceCards: React.FC<CustomServiceCardsProps> = ({
  item,
  handleRemoveService,
  handleRemoveScheduledDate,
  setApprovedSlot,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Helper functions to safely access properties
  const getServiceId = (): string => {
    return item.serviceId || item.id || '';
  };

  const getSchedule = (): any[] => {
    return item.schedule || item.selectedDates || [];
  };
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
    <View style={styles.container}>
      <TouchableOpacity
        key={getServiceId()}
        style={styles.serviceContainer}
        onPress={() => {
          navigation.navigate('Service Details', item);
        }}>
        {/* Service Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: item.servicePreview[0]?.uri,
            }}
            style={styles.serviceImage}
          />
        </View>

        {/* Service Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <CustomText
              style={styles.serviceTitle}
              label={item.title}
              numberOfLines={2}
            />
            {handleRemoveService && (
              <TouchableOpacity
                style={styles.removeServiceButton}
                onPress={() => {
                  handleRemoveService(item.serviceId);
                }}>
                <Icon
                  name="delete-outline"
                  size={FontSize.medium}
                  color={COLORS.error}
                />
              </TouchableOpacity>
            )}
          </View>
          <CustomText
            style={styles.descriptionText}
            label={item.description}
            numberOfLines={2}
          />
          <CustomText
            style={styles.descriptionText}
            label={item.category}
            numberOfLines={2}
          />

          <View style={styles.metaRow}>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={FontSize.small} color={COLORS.warning} />
              <CustomText
                style={styles.ratingText}
                label={` ${item.ratings}`}
              />
            </View>
            <CustomText
              style={styles.priceText}
              label={`$${item.pricing}/day`}
            />
          </View>

          {!handleRemoveService && (
            <TouchableOpacity
              style={styles.viewScheduleButton}
              onPress={() => toggleScheduleVisibility(item.serviceId)}>
              <CustomText
                style={styles.viewScheduleText}
                label={
                  visibleSchedules[item.serviceId]
                    ? 'Hide Schedule'
                    : 'View Schedule'
                }
              />
              <Icon
                name={
                  visibleSchedules[item.serviceId]
                    ? 'keyboard-arrow-up'
                    : 'keyboard-arrow-down'
                }
                size={FontSize.small}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      {/* Schedule Details Section */}
      {(visibleSchedules[item.serviceId] || handleRemoveService) && (
        <View style={styles.scheduleSection}>
          <ScheduleDetails
            schedule={item.schedule}
            maxDisplay={SCHEDULE.MAX_SCHEDULE_DISPLAY}
            serviceId={item.serviceId}
            handleRemoveScheduledDate={handleRemoveScheduledDate}
            onServiceSelect={() => {}}
            selectedServices={[]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginVertical: Spacing.small,
    padding: Spacing.medium,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  serviceContainer: {
    flexDirection: 'row',
  },
  imageContainer: {
    marginRight: Spacing.medium,
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    // marginBottom: Spacing.small,
  },
  serviceTitle: {
    fontSize: FontSize.large,
    fontWeight: '600',
    color: COLORS.black,
    flex: 1,
    marginRight: Spacing.small,
  },
  removeServiceButton: {
    padding: Spacing.small,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: FontSize.small,
    color: COLORS.gray,
    fontWeight: '500',
  },
  priceText: {
    fontSize: FontSize.medium,
    fontWeight: '600',
    color: COLORS.primary,
  },
  descriptionText: {
    fontSize: FontSize.small,
    color: COLORS.gray,
    lineHeight: 18,
  },
  viewScheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  viewScheduleText: {
    fontSize: FontSize.small,
    color: COLORS.primary,
    fontWeight: '500',
    marginRight: 4,
  },
  scheduleSection: {
    marginTop: Spacing.medium,
    paddingTop: Spacing.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  scheduleSectionTitle: {
    fontSize: FontSize.medium,
    fontWeight: '600',
    color: COLORS.black,
  },
  scheduleItemsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.small,
  },
  scheduleItemContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    borderWidth: 1,
    borderColor: COLORS.primary,
    position: 'relative',
    minWidth: 100,
  },
  scheduleContainer: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: COLORS.primary,
    textAlign: 'center',
  },
  moreButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.small,
  },
  moreText: {
    color: COLORS.primary,
    fontSize: FontSize.small,
    fontWeight: '500',
  },
  selectedSchedule: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  selectedTextColor: {
    color: COLORS.white,
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default CustomServiceCards;
