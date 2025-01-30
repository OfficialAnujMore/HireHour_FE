import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {logout, RootState} from '../../redux/store';
import CustomSearchBar from '../../components/CustomSearchBar';
import CustomCards from '../../components/CustomCards';
import CustomText from '../../components/CustomText';
import {FontSize, Screen, Spacing} from '../../utils/dimension';
import {COLORS} from '../../utils/globalConstants/color';
import CustomSchedule from '../../components/CustomSchedule';
import CustomCarouselSlider from '../../components/CustomCarousel';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {WORD_DIR} from 'utils/local/en';
import {CustomRatingInfo} from '../../components/CustomRatingInfo';
import CustomButton from '../../components/CustomButton';
import {bookService} from '../../services/serviceProviderService';
import CustomSlider from '../../components/CustomSlider';
import {addToCart} from '../../redux/cartSlice';
interface ServiceDetails {
  id: string;
  title: string;
  description: string;
  location: string;
  status: string;
  offer: string | null;
  rating: number;
  time: string;
  distance: string;
  image: string;
  previewImages: [];
}
const ServiceDetailsScreen = (props: ServiceDetails) => {
  const navigation = useNavigation();
  const [selectedTimeId, setSelectedTimeId] = useState<string | null>(null);
  const item = props.route.params;

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const handlePress = async () => {
    // const response = await bookService({ userId: user?.id, timeSlotId: selectedTimeId })

    // Alert.alert("Success", "Service booked");

    // const cartItem = {
    //   id: item.id,
    //   title: item.title,
    //   description: item.description,
    //   image: item.image,
    //   price: 100, // You can replace this with the actual price
    //   quantity: 1, // Default quantity is 1
    // };

    dispatch(addToCart(item)); // Dispatch action to add item to the cart
    Alert.alert('Added to Cart', `${item.title} has been added to your cart.`);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <CustomCarouselSlider data={item.servicePreview} />
        <View style={styles.detailsContainer}>
          <View style={styles.header}>
            <CustomText label={item.title} style={styles.textStyle} />
            <CustomRatingInfo rating={item.ratings} />
          </View>
          <CustomText label={item.description} style={styles.textStyle} />
        </View>
        <CustomSchedule
          dateInfo={item.schedule}
          selectedTimeId={selectedTimeId}
          onValueChange={id => {
            setSelectedTimeId(id);
          }}
        />

        <CustomButton label={'Add to cart'} onPress={handlePress} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: Spacing.small,
  },
  carouselContainer: {
    height: Screen.height / 4,
    backgroundColor: COLORS.grey,
  },
  detailsContainer: {
    marginVertical: Spacing.small,
  },
  textStyle: {
    fontSize: FontSize.medium,
    fontWeight: '400',
  },
  ratingStyle: {
    fontSize: FontSize.small,
    color: COLORS.white,
  },
  content: {
    flex: 1,
    marginLeft: Spacing.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingsContainer: {
    backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.small,
    padding: Spacing.small / 2,
  },
});

export default ServiceDetailsScreen;
