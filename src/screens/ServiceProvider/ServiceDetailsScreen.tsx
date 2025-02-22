import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
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
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the pencil icon
import {deleteServiceById} from '../../services/serviceProviderService';
import {showSnackbar} from '../../redux/snackbarSlice';

const ServiceDetailsScreen = (props: ServiceDetails) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const item = props.route.params;
  const user = useSelector((state: RootState) => state.auth.user);

  const [selectedServices, setSelectedServices] = useState<ServiceDetails[]>(
    [],
  );

  const handleSelectService = (service: ServiceDetails) => {
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

  const handlePress = async () => {
    const updatedItems = {
      ...item,
      schedule: selectedServices,
    };
    dispatch(addToCart(updatedItems));
  };

  // Navigate to the Edit Service Screen
  const handleEditService = () => {
    // console.log(JSON.stringify(item));

    navigation.navigate('Create Service', item);
  };

  const handleDeleteService = async () => {
    // console.log(item.serviceId);

    const response = await deleteServiceById(item.serviceId);
    if (response.success) {
      navigation.goBack();
    }
    console.log(response);
    
    dispatch(
      showSnackbar({
        message: response.message,
        success:response.success
      }),
    );
  };

  // Set header options to add edit icon
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <Icon
            name="edit"
            size={25}
            color={COLORS.primary}
            onPress={handleEditService} // Navigate to edit screen
          />
          <Icon
            name="delete"
            size={25}
            color={COLORS.error}
            onPress={handleDeleteService} // Navigate to edit screen
          />
        </>
      ),
    });
  }, [navigation, item]);

  return (
    <View style={globalStyle.globalContainer}>
      <ScrollView>
        <CustomCarouselSlider data={item.servicePreview} />
        <View style={styles.headerContainer}>
          <CustomText label={item.title} />
          <CustomRatingInfo rating={item.ratings} />
        </View>
        <CustomText label={item.description} />

        <ScheduleDetails
          schedule={item.schedule}
          onServiceSelect={handleSelectService}
          selectedServices={selectedServices}
          maxDisplay={item.schedule.length}
        />
      </ScrollView>
      <CustomButton label={'Add to cart'} onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: Spacing.small,
    flexDirection: 'row',
    alignItems: 'center', // Align items horizontally
    justifyContent: 'space-between', // Space between title and edit icon
  },

  editIconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: Spacing.medium,
  },
});

export default ServiceDetailsScreen;
