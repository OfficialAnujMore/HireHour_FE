import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import CustomText from '../../components/CustomText';
import {FontSize, Screen, Spacing} from '../../utils/dimension';
import {COLORS} from '../../utils/globalConstants/color';
import CustomCarouselSlider from '../../components/CustomCarousel';
import {useNavigation} from '@react-navigation/native';
import {CustomRatingInfo} from '../../components/CustomRatingInfo';
import CustomButton from '../../components/CustomButton';
import {addToCart} from '../../redux/cartSlice';
import {ServiceDetails} from 'interfaces';
import {ScheduleDetails} from '../../components/CustomServiceCard';

const ServiceDetailsScreen = (props: ServiceDetails) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const item = props.route.params;
  const user = useSelector((state: RootState) => state.auth.user);

  // Add a state to track selected services
  const [selectedServices, setSelectedServices] = useState<ServiceDetails[]>(
    [],
  );

  const handleSelectService = (service: ServiceDetails) => {
    setSelectedServices(prevState => {
      // Check if the service is already selected
      const isServiceSelected = prevState.some(s => s.id === service.id);

      // If the service is already selected, remove it and set isAvailable back to true
      if (isServiceSelected) {
        return prevState
          .filter(s => s.id !== service.id)
          .map(s => ({
            ...s,
            isAvailable: true, // Set isAvailable back to true when removed
          }));
      } else {
        // If not selected, set isAvailable to false and add the service
        return [
          ...prevState,
          {
            ...service,
            isAvailable: false, // Set isAvailable to false when selected
          },
        ];
      }
    });
  };

  // useEffect(()=>{
  //   
  // }, [selectedServices])

  const handlePress = async () => {
    // // Prepare the schedule based on selected services
    const updatedItems = {
      ...item,
      schedule: selectedServices,
    };
    // 
    
    dispatch(addToCart(updatedItems));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.detailsContainer}>
          <CustomCarouselSlider data={item.servicePreview} />
          <View style={styles.header}>
            <CustomText label={item.title} style={styles.textStyle} />
            <CustomRatingInfo rating={item.ratings} />
          </View>
          <CustomText label={item.description} style={styles.textStyle} />

          <ScheduleDetails
            schedule={item.schedule}
            onServiceSelect={handleSelectService}
            selectedServices={selectedServices}
          />
        </View>
      </ScrollView>
      <CustomButton label={'Add to cart'} onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: Spacing.small,
  },
  detailsContainer: {
    marginVertical: Spacing.small,
  },
  textStyle: {
    fontSize: FontSize.medium,
    fontWeight: '400',
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
});

export default ServiceDetailsScreen;
