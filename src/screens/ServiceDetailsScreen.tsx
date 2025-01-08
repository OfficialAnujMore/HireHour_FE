import React from 'react';
import { View, Text, Button, Alert, FlatList, StyleSheet, ScrollView } from 'react-native';;
import { useDispatch, useSelector } from 'react-redux';
import { logout, RootState } from '../redux/store';
import CustomSearchBar from '../components/CustomSearchBar';
import CustomCards from '../components/CustomCards';
import CustomText from '../components/CustomText';
import { FontSize, Screen, Spacing } from '../utils/dimension';
import { COLOR } from '../utils/globalConstants/color';
import CustomSchedule from '../components/CustomSchedule';
import CustomCarouselSlider from '../components/CustomCarousel';
import { useNavigation } from '@react-navigation/native';
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
  previewImages: []
};
const ServiceDetailsScreen = (props: ServiceDetails) => {
  const navigation = useNavigation();
  const item = props.route.params
  console.log(item);

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const handlePress = () => {
    Alert.alert('Button Pressed!');
  };



  return (
    <View style={styles.container}>
      <ScrollView>
        <CustomCarouselSlider />
        <View style={styles.detailsContainer}>
          <View style={styles.header}>
            <CustomText label={item.title} style={styles.textStyle} />
            <CustomText label={`⭐️  ${item.rating}`} style={[styles.ratings, styles.textStyle, styles.ratingStyle]} />
          </View>
          <CustomText label={item.description} style={styles.textStyle} />
          <CustomText label={item.location} style={styles.textStyle} />
          <CustomText label={'Reviews'} style={styles.textStyle} action={() => {
            navigation.navigate("Reviews")
          }} />
          <CustomText label={'CreateServiceScreen'} style={styles.textStyle} action={() => {
            navigation.navigate("CreateServiceScreen")
          }} />
          CreateServiceScreen
        </View>
        <CustomSchedule />
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: Spacing.small,
  },
  carouselContainer: {
    height: Screen.height / 4,
    backgroundColor: COLOR.grey,
  },
  detailsContainer: {
    marginVertical: Spacing.small

  },
  textStyle: {
    fontSize: FontSize.medium,
    fontWeight: '400',
  },
  ratingStyle: {
    fontSize: FontSize.small,
    color: COLOR.white
  },
  content: {
    flex: 1,
    marginLeft: Spacing.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor:"red"
  },
  ratings: {
    flexDirection: 'row',
    backgroundColor: 'green',
    justifyContent: 'center',
    borderRadius: Spacing.small,
    padding: Spacing.small / 2,
    // paddingHorizontal: Spacing.small
  }
})

export default ServiceDetailsScreen;
