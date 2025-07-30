import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import CustomText from '../../components/CustomText';
import {FontSize, Spacing} from '../../utils/dimension';
import {COLORS} from '../../utils/globalConstants/color';
import CustomCarouselSlider from '../../components/CustomCarousel';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'interfaces';
import {CustomRatingInfo} from '../../components/CustomRatingInfo';
import CustomButton from '../../components/CustomButton';
import {addToCart} from '../../redux/cartSlice';
import {ServiceDetails} from 'interfaces';
import {ScheduleDetails} from '../../components/CustomServiceCard';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  deleteServiceById,
  holdSlot,
} from '../../services/serviceProviderService';
import {showSnackbar} from '../../redux/snackbarSlice';
import {FallBack} from '../../components/FallBack';
import {WORD_DIR} from '../../utils/local/en';
import {VENUE, US_STATES, MAX_FIELD_CHAR_COUNT} from '../../utils/constants';
import {URL_REGEX} from '../../utils/regex';
import CustomDropdown from '../../components/CustomDropdown';
import CustomInput from '../../components/CustomInput';

const ServiceDetailsScreen = (props: any) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  const item = props.route.params || {};
  const user = useSelector((state: RootState) => state.auth.user);

  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<string>('');
  const [meetingUrl, setMeetingUrl] = useState<string>('');
  const [addressInfo, setAddressInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    state: '',
    country: 'US',
  });

  const venueOptions = [
    {
      id: VENUE.ONLINE,
      label: 'Online',
      description: 'Virtual meeting via video call',
      icon: 'videocam',
      color: COLORS.primary,
    },
    {
      id: VENUE.IN_PERSON,
      label: 'In Person',
      description: 'Physical location meeting',
      icon: 'location-on',
      color: COLORS.success,
    },
  ];

  const handleSelectService = (service: any) => {
    setSelectedServices(prevState => {
      const isServiceSelected = prevState.some(s => s.id === service.id);

      if (isServiceSelected) {
        return prevState
          .filter(s => s.id !== service.id)
          .map(s => ({
            ...s,
            isAvailable: true,
          }));
      } else {
        return [
          ...prevState,
          {
            ...service,
            isAvailable: false,
          },
        ];
      }
    });
  };

  const validateInputs = () => {
    console.log('Validation check:', {
      selectedServices: selectedServices.length,
      selectedVenue,
      meetingUrl,
      addressInfo
    });

    // No slot selected? => Invalid
    if (selectedServices.length === 0) {
      console.log('No services selected');
      return false;
    }

    // Venue not selected yet? => Invalid
    if (!selectedVenue) {
      console.log('No venue selected');
      return false;
    }

    // Online mode => meeting URL must be valid
    if (selectedVenue === VENUE.ONLINE) {
      const isValidUrl = URL_REGEX.test(meetingUrl.trim());
      console.log('Online validation:', { meetingUrl, isValidUrl });
      return isValidUrl;
    }

    // In Person mode => address fields must be filled
    if (selectedVenue === VENUE.IN_PERSON) {
      const allFieldsFilled = Object.values(addressInfo).every(field => field.trim() !== '');
      console.log('In Person validation:', { addressInfo, allFieldsFilled });
      return allFieldsFilled;
    }

    console.log('No matching venue type');
    return false;
  };

  const handlePress = async () => {
    if (!validateInputs()) {
      dispatch(
        showSnackbar({message: 'Please fill valid details', success: false}),
      );
      return;
    }

    const updatedItems = {
      ...item,
      schedule: selectedServices,
      venue: selectedVenue,
      meetingUrl: meetingUrl,
      addressInfo: addressInfo,
    };

    const response = await holdSlot(selectedServices as any);
    if (response) {
      dispatch(addToCart(updatedItems));
      navigation.navigate('Tabs', {screen: 'Cart'});
    }
  };

  const handleEditService = () => {
    navigation.navigate('Create Service', item);
  };

  const handleDeleteService = async () => {
    const response = await deleteServiceById(item.serviceId, user?.fcmToken);
    if (response.success) {
      navigation.goBack();
    }

    dispatch(
      showSnackbar({
        message: response.message,
        success: response.success,
      }),
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        item.userId === user?.id ? (
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={handleEditService}
              style={styles.headerButton}>
              <Icon name="edit" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeleteService}
              style={styles.headerButton}>
              <Icon name="delete" size={20} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        ) : null,
    });
  }, [navigation, item, user]);

  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        {/* Images */}
        <View style={styles.imageContainer}>
          <CustomCarouselSlider data={item.servicePreview} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title and Price */}
          <View style={styles.titleSection}>
            <CustomText label={item.title} style={styles.title}  numberOfLines={5}/>
            <CustomText label={`$${item.pricing}/day`} style={styles.price} />
          </View>

          {/* Category and Rating */}
          <View style={styles.metaSection}>
            <View style={styles.categoryContainer}>
              <Icon name="category" size={16} color={COLORS.gray} />
              <CustomText label={item.category} style={styles.category} />
            </View>
            <CustomRatingInfo rating={item.ratings} />
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <CustomText
              label="About this service"
              style={styles.sectionTitle}
            />
            <CustomText label={item.description} style={styles.description} numberOfLines={5} />
          </View>

          {/* Provider Info */}
          {item.user && (
            <View style={styles.providerSection}>
              <CustomText
                label="Service provider"
                style={styles.sectionTitle}
              />
              <View style={styles.providerInfo}>
                <View style={styles.avatar}>
                  {item.user.profileImageURL ? (
                    <Image
                      source={{uri: item.user.profileImageURL}}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <Icon name="person" size={24} color={COLORS.white} />
                  )}
                </View>
                <View style={styles.providerDetails}>
                  <CustomText
                    label={`${item.user.firstName} ${item.user.lastName}`}
                    style={styles.providerName}
                  />
                  <CustomText
                    label={item.user.email}
                    style={styles.providerEmail}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Schedule */}
          <View style={styles.scheduleSection}>
            <View style={styles.scheduleHeader}>
              <CustomText label="Available dates" style={styles.sectionTitle} />
              <CustomText
                label={`${item.schedule.length} dates`}
                style={styles.dateCount}
              />
            </View>

            {item.schedule.length > 0 ? (
              <ScheduleDetails
                schedule={item.schedule}
                onServiceSelect={handleSelectService}
                selectedServices={selectedServices}
                maxDisplay={item.schedule.length}
              />
            ) : (
              <View style={styles.emptySchedule}>
                <FallBack heading={WORD_DIR.noSchedule} navigationRoute="Tabs" />
              </View>
            )}
          </View>

          {/* Venue Selection and Booking Details */}
          {item.schedule.length > 0 && item.userId !== user?.id && (
            <View style={styles.bookingSection}>
              <CustomText
                label="Booking Details"
                style={styles.sectionTitle}
              />

              {/* Venue Selection */}
              <View style={styles.venueSection}>
                <CustomText
                  label={WORD_DIR.selectVenue}
                  style={styles.sectionSubtitle}
                />
                
                <View style={styles.venueOptionsContainer}>
                  {venueOptions.map(option => (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.venueOption,
                        selectedVenue === option.id && styles.selectedVenueOption,
                      ]}
                      onPress={() => {
                        setSelectedVenue(option.id);
                        // Clear fields when venue changes
                        setMeetingUrl('');
                        setAddressInfo({
                          address: '',
                          city: '',
                          postalCode: '',
                          state: '',
                          country: 'US',
                        });
                      }}>
                      <View style={styles.venueContent}>
                        <View style={[styles.venueIconContainer, {backgroundColor: option.color + '20'}]}>
                          <Icon
                            name={option.icon}
                            size={24}
                            color={option.color}
                          />
                        </View>
                        <View style={styles.venueDetails}>
                          <CustomText style={styles.venueLabel} label={option.label} />
                          <CustomText style={styles.venueDescription} label={option.description} />
                        </View>
                      </View>
                      {selectedVenue === option.id && (
                        <View style={styles.selectedIndicator}>
                          <Icon name="check-circle" size={20} color={COLORS.success} />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Meeting URL for Online */}
              {selectedVenue === VENUE.ONLINE && (
                <View style={styles.inputSection}>
                  <CustomInput
                    label="Meeting URL"
                    placeholder="Enter Meeting URL"
                    value={meetingUrl}
                    onValueChange={setMeetingUrl}
                    keyboardType="url"
                  />
                </View>
              )}

              {/* Address Fields for In Person */}
              {selectedVenue === VENUE.IN_PERSON && (
                <View style={styles.addressSection}>
                  <CustomText
                    label="Location Details"
                    style={styles.sectionSubtitle}
                  />
                  
                  <CustomInput
                    label="Address"
                    placeholder="Enter Address"
                    value={addressInfo.address}
                    onValueChange={text =>
                      setAddressInfo({...addressInfo, address: text})
                    }
                  />
                  
                  <CustomInput
                    label="City"
                    placeholder="Enter City"
                    value={addressInfo.city}
                    onValueChange={text =>
                      setAddressInfo({...addressInfo, city: text})
                    }
                  />
                  
                  <CustomInput
                    label="Postal Code"
                    placeholder="Enter Postal Code"
                    value={addressInfo.postalCode}
                    onValueChange={text =>
                      setAddressInfo({...addressInfo, postalCode: text})
                    }
                    maxLength={MAX_FIELD_CHAR_COUNT.postalCode}
                    keyboardType="numeric"
                  />
                  
                  <CustomDropdown
                    label="State"
                    options={US_STATES}
                    value={addressInfo.state}
                    onValueChange={value =>
                      setAddressInfo({...addressInfo, state: value})
                    }
                    placeholder="Select State"
                  />
                  
                  <CustomInput
                    label="Country"
                    placeholder="Enter Country"
                    value={addressInfo.country}
                    disabled={true}
                  />
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Button */}
      {item.schedule.length > 0 && item.userId !== user?.id && (
        <View style={styles.bottomContainer}>
          <CustomButton
            label="Add to cart"
            onPress={handlePress}
            disabled={!validateInputs()}
            style={styles.addButton}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.medium,
  },
  headerButton: {
    padding: Spacing.small,
  },
  imageContainer: {
    height: 250,
  },
  content: {
    padding: Spacing.medium,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.medium,
  },
  title: {
    fontSize: FontSize.extraLarge,
    fontWeight: '700',
    color: COLORS.black,
    flex: 1,
    marginRight: Spacing.medium,
  },
  price: {
    fontSize: FontSize.large,
    fontWeight: '600',
    color: COLORS.primary,
  },
  metaSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.large,
    paddingBottom: Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  category: {
    fontSize: FontSize.small,
    color: COLORS.gray,
    fontWeight: '500',
  },
  ratingText: {
    fontSize: FontSize.small,
    color: COLORS.gray,
    fontWeight: '500',
  },
  descriptionSection: {
    marginBottom: Spacing.large,
  },
  sectionTitle: {
    fontSize: FontSize.large,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: Spacing.small,
  },
  sectionSubtitle: {
    fontSize: FontSize.medium,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: Spacing.medium,
  },
  description: {
    fontSize: FontSize.medium,
    color: COLORS.gray,
    lineHeight: 22,
  },
  providerSection: {
    marginBottom: Spacing.large,
    paddingBottom: Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.medium,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: FontSize.medium,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 2,
  },
  providerEmail: {
    fontSize: FontSize.small,
    color: COLORS.gray,
  },
  scheduleSection: {
    marginBottom: Spacing.large,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.medium,
  },
  dateCount: {
    fontSize: FontSize.small,
    color: COLORS.gray,
    fontWeight: '500',
  },
  emptySchedule: {
    paddingVertical: Spacing.large,
    alignItems: 'center',
  },
  bookingSection: {
    marginBottom: Spacing.large,
  },
  venueSection: {
    marginBottom: Spacing.large,
  },
  venueOptionsContainer: {
    marginBottom: Spacing.medium,
  },
  venueOption: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: Spacing.medium,
    marginBottom: Spacing.medium,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedVenueOption: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: COLORS.primary + '05',
  },
  venueContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  venueIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.medium,
  },
  venueDetails: {
    flex: 1,
  },
  venueLabel: {
    fontSize: FontSize.medium,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 2,
  },
  venueDescription: {
    fontSize: FontSize.small,
    color: COLORS.gray,
  },
  selectedIndicator: {
    marginLeft: Spacing.small,
  },
  inputSection: {
    marginBottom: Spacing.large,
  },
  addressSection: {
    marginBottom: Spacing.large,
  },
  bottomContainer: {
    padding: Spacing.small,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
});

export default ServiceDetailsScreen;
