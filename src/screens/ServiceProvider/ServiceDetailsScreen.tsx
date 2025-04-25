import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import CustomText from '../../components/CustomText';
import { FontSize, Spacing, Screen } from '../../utils/dimension';
import { COLORS } from '../../utils/globalConstants/color';
import CustomCarouselSlider from '../../components/CustomCarousel';
import { useNavigation } from '@react-navigation/native';
import { CustomRatingInfo } from '../../components/CustomRatingInfo';
import CustomButton from '../../components/CustomButton';
import { addToCart } from '../../redux/cartSlice';
import { ServiceDetails } from 'interfaces';
import { ScheduleDetails } from '../../components/CustomServiceCard';
import { globalStyle } from '../../utils/globalStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { deleteServiceById } from '../../services/serviceProviderService';
import { showSnackbar } from '../../redux/snackbarSlice';
import { FallBack } from '../../components/FallBack';
import { WORD_DIR } from '../../utils/local/en';
import * as Animatable from 'react-native-animatable';

const ServiceDetailsScreen = (props: ServiceDetails) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const item = props.route.params;
  const user = useSelector((state: RootState) => state.auth.user);

  const [selectedServices, setSelectedServices] = useState<ServiceDetails[]>([]);

  const handleSelectService = (service: ServiceDetails) => {
    setSelectedServices(prevState => {
      const isServiceSelected = prevState.some(s => s.id === service.id);
      if (isServiceSelected) {
        return prevState.filter(s => s.id !== service.id);
      } else {
        return [...prevState, service];
      }
    });
  };

  const handlePress = () => {
    const updatedItems = { ...item, schedule: selectedServices };
    dispatch(addToCart(updatedItems));
    navigation.navigate('Tabs', { screen: 'Cart' });
  };

  const handleEditService = () => {
    navigation.navigate('Create Service', item);
  };

  const handleDeleteService = async () => {
    const response = await deleteServiceById(item.serviceId, user?.fcmToken);
    if (response.success) {
      navigation.goBack();
    }
    dispatch(showSnackbar({ message: response.message, success: response.success }));
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        item.userId === user?.id ? (
          <View style={styles.iconContainer}>
            <Icon name="edit" size={25} color={COLORS.primary} onPress={handleEditService} />
            <Icon name="delete" size={25} color={COLORS.error} onPress={handleDeleteService} />
          </View>
        ) : null,
    });
  }, [navigation, item, user]);

  return (
    <View style={globalStyle.globalContainer}>
      <ScrollView>
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
          </Animatable.View>
        ) : (
          <FallBack heading={WORD_DIR.noSchedule} />
        )}
      </ScrollView>

      {item.schedule.length > 0 && item.userId !== user?.id && (
        <Animatable.View animation="fadeInUp" duration={800}>
          <CustomButton label={'Add to cart'} onPress={handlePress} />
        </Animatable.View>
      )}
    </View>
  );
};

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
    marginTop: Spacing.medium,
    marginBottom: Spacing.small,
  },
  description: {
    fontSize: FontSize.small,
    color: COLORS.gray,
  },
});

export default ServiceDetailsScreen;
