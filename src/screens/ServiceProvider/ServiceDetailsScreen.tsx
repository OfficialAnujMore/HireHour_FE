import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, TextInput} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import CustomText from '../../components/CustomText';
import {FontSize, Spacing} from '../../utils/dimension';
import {COLORS} from '../../utils/globalConstants/color';
import CustomCarouselSlider from '../../components/CustomCarousel';
import {useNavigation} from '@react-navigation/native';
import {CustomRatingInfo} from '../../components/CustomRatingInfo';
import CustomButton from '../../components/CustomButton';
import {addToCart} from '../../redux/cartSlice';
import {ServiceDetails} from 'interfaces';
import {ScheduleDetails} from '../../components/CustomServiceCard';
import {globalStyle} from '../../utils/globalStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  deleteServiceById,
  holdSlot,
} from '../../services/serviceProviderService';
import {showSnackbar} from '../../redux/snackbarSlice';
import {FallBack} from '../../components/FallBack';
import {WORD_DIR} from '../../utils/local/en';
import * as Animatable from 'react-native-animatable';
import CustomDropdown from '../../components/CustomDropdown';
import {MAX_FIELD_CHAR_COUNT, US_STATES, VENUE} from '../../utils/constants';
import CustomInput from '../../components/CustomInput';
import {URL_REGEX} from '../../utils/regex';
import CustomAvatar from '../../components/CustomAvatar';
import renderInput from '../../utils/renderInputUtil';

const ServiceDetailsScreen = (props: ServiceDetails) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const item = props.route.params;
  const user = useSelector((state: RootState) => state.auth.user);

  const [selectedServices, setSelectedServices] = useState<ServiceDetails[]>(
    [],
  );
  const [venue, setVenue] = useState<string>('');
  const [meetingUrl, setMeetingUrl] = useState<string>('');
  const [addressInfo, setAddressInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    state: '',
    country: 'US',
  });

  const handleSelectService = (service: ServiceDetails) => {
    setSelectedServices(prevState => {
      const isServiceSelected = prevState.some(s => s.id === service.id);
      return isServiceSelected
        ? prevState.filter(s => s.id !== service.id)
        : [...prevState, service];
    });
  };

  const validateInputs = () => {
    // No slot selected? => Invalid
    if (selectedServices.length === 0) {
      return false;
    }

    // Venue not selected yet? => Invalid
    if (!venue) {
      return false;
    }

    // Online mode => meeting URL must be valid
    if (venue === VENUE.online) {
      return URL_REGEX.test(meetingUrl.trim());
    }

    // Offline mode => address fields must be filled
    if (venue === VENUE.offline) {
      return Object.values(addressInfo).every(field => field.trim() !== '');
    }

    return false; // default
  };

  const handleProceed = async () => {
    if (!validateInputs()) {
      dispatch(
        showSnackbar({message: 'Please fill valid details', success: false}),
      );
      return;
    }

    const updatedItems = {
      ...item,
      schedule: selectedServices,
      venue: venue,
      meetingUrl: meetingUrl,
      addressInfo: addressInfo,
    };

    const response = await holdSlot(selectedServices);
    if (response) {
      dispatch(addToCart(updatedItems));
      navigation.navigate('Tabs', {screen: 'Cart'});
    }
  };

  const handleEditService = () => navigation.navigate('Create Service', item);

  const handleDeleteService = async () => {
    const response = await deleteServiceById(item.serviceId, user?.fcmToken);
    if (response.success) navigation.goBack();
    dispatch(
      showSnackbar({message: response.message, success: response.success}),
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        item.userId === user?.id && (
          <View style={styles.iconContainer}>
            <Icon
              name="edit"
              size={25}
              color={COLORS.primary}
              onPress={handleEditService}
            />
            <Icon
              name="delete"
              size={25}
              color={COLORS.error}
              onPress={handleDeleteService}
            />
          </View>
        ),
    });
  }, [navigation, item, user]);

  return (
    <View style={globalStyle.globalContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeIn" duration={600}>
          <CustomCarouselSlider data={item.servicePreview} />
        </Animatable.View>

        <View style={styles.headerContainer}>
          <CustomText label={item.title} style={styles.title} />
          <CustomRatingInfo rating={item.ratings} />
        </View>

        <View style={styles.headerContainer}>
          <CustomText label={item.category} style={styles.category} />
          <CustomText label={`$ ${item.pricing}`} style={styles.price} />
        </View>

        <CustomText
          label={WORD_DIR.artistDetails}
          style={styles.sectionTitle}
        />
        <View style={styles.profileView}>
          <CustomAvatar name={item.name} imageUrl={item.avatarUri} />
          <View style={styles.profileDetails}>
            <CustomText label={`${item.name}`} style={styles.description} />
            <CustomText
              label={`${item.email}`}
              style={styles.description}
              action={() => {
                console.log('contact email');
              }}
            />
            <CustomText
              label={`${item.phoneNumber}`}
              style={styles.description}
              action={() => {
                console.log('contact phone number');
              }}
            />
          </View>
        </View>

        <CustomText label={WORD_DIR.description} style={styles.sectionTitle} />
        <CustomText label={item.description} style={styles.description} />

        {item.schedule.length > 0 ? (
          <Animatable.View animation="fadeInUp" duration={600}>
            <ScheduleDetails
              schedule={item.schedule}
              onServiceSelect={handleSelectService}
              selectedServices={selectedServices}
              maxDisplay={item.schedule.length}
            />
            {/* VENUE Details Section */}
            {item.userId !== user?.id && (
              <>
                <CustomText
                  label="Booking Details"
                  style={styles.sectionTitle}
                />

                <CustomDropdown
                  label="Venue"
                  options={VENUE}
                  value={venue}
                  onValueChange={value => {
                    setVenue(value);
                    setMeetingUrl('');
                    setAddressInfo({
                      address: '',
                      city: '',
                      postalCode: '',
                      state: '',
                      country: 'US',
                    });
                  }}
                  placeholder="Select Venue"
                />

                {venue === VENUE.online && (
                  <CustomInput
                    label="Meeting URL"
                    placeholder="Enter Meeting URL"
                    value={meetingUrl}
                    onValueChange={setMeetingUrl}
                    keyboardType="url"
                  />
                )}

                {venue === VENUE.offline && (
                  <>
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
                      placeholder="Select an option"
                    />
                    <CustomInput
                      label="Country"
                      placeholder="Enter Country"
                      value={addressInfo.country}
                      disabled={true}
                    />
                  </>
                )}

                <CustomButton
                  label="Confirm Booking"
                  onPress={handleProceed}
                  disabled={!validateInputs()}
                  style={{marginTop: Spacing.medium}}
                />
              </>
            )}
          </Animatable.View>
        ) : (
          <FallBack heading={WORD_DIR.noSchedule} />
        )}
      </ScrollView>
    </View>
  );
};

export default ServiceDetailsScreen;

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: Spacing.small,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    flexDirection: 'row',
    gap: Spacing.medium,
  },
  title: {
    fontSize: FontSize.large,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  category: {
    fontSize: FontSize.medium,
    color: COLORS.gray,
  },
  price: {
    fontSize: FontSize.medium,
    color: COLORS.primary,
  },
  sectionTitle: {
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    marginVertical: Spacing.medium,
    color: COLORS.primary,
  },
  description: {
    fontSize: FontSize.small + 2,
    color: COLORS.gray,
    marginBottom: Spacing.medium,
  },

  additionalDetailsCard: {
    backgroundColor: COLORS.gray,
    padding: Spacing.medium,
    borderRadius: 12,
    marginTop: Spacing.medium,
  },
  input: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
    marginBottom: Spacing.small,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  profileView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileDetails: {
    flex: 1,
    marginLeft: Spacing.small,
  },
});
