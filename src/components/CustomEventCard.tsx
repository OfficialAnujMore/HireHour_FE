import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { COLORS } from '../utils/globalConstants/color';
import { FontSize, Screen, Spacing } from '../utils/dimension';
import CustomText from './CustomText';
import { useNavigation } from '@react-navigation/native';
import { CustomRatingInfo } from './CustomRatingInfo';
import Icon from 'react-native-vector-icons/Ionicons';
interface CustomCardsProps {
  item: {
    avatarUri?: string;
    title: string;
    description: string;
    category: string;
    chargesPerHour: string;
    ratings: number;
  };
  handlePress:()=>{}
}

const CustomEventCard: React.FC<CustomCardsProps> = ({ item,handlePress }) => {
  const navigation = useNavigation();
  console.log(item);
  
//   {
//     "id": "4f6255d1-b1ef-4643-8f66-a8356e0d97a7",
//     "time": "04:00 PM",
//     "available": false,
//     "bookedUserId": "6ae2d3e4-0d3e-4ce6-ab80-17fadb1ae638",
//     "scheduleId": "15c2589d-1548-4747-8640-c4c97acf6c41",
//     "day": "Wed",
//     "month": "Jan",
//     "fullDate": "2025-01-30T05:21:17.184Z",
//     "date": "29",
//     "title": "Artist service",
//     "description": "This is a service",
//     "isDeleted": null,
//     "isDisabled": null,
//     "createdAt": "2025-01-22T05:21:20.325Z",
//     "updatedAt": "2025-01-22T05:21:20.325Z"
// }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      {item.avatarUri ? (
        <Image
          source={{ uri: item.avatarUri }}
          style={styles.image}
          accessibilityLabel="User Avatar"
        />
      ) : (
        <View style={[styles.image,styles.iconFallback]}>
          <Icon name="person-outline" size={FontSize.extraLarge * 1.5} color={COLORS.black} />
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <CustomText label={item.title} style={styles.textStyle} />
          <CustomRatingInfo rating={'5.0'} />
        </View>
        <CustomText label={item.description} style={styles.textStyle} />
        <CustomText label={`${item.date} ${item.month}` } style={styles.textStyle} />
        <CustomText label={item.time} style={styles.textStyle} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: Spacing.small,
    marginVertical: Spacing.small,
    padding: Spacing.small,
    shadowColor:COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  textStyle: {
    fontSize: FontSize.medium,
    fontWeight: '400',
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: Screen.width * 0.25,
    height: Screen.width * 0.25,
    borderRadius: Spacing.small,
  },
  iconFallback: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: COLORS.grey,
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
});

export default CustomEventCard;
