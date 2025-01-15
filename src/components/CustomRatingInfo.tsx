import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomText from './CustomText';
import { useNavigation } from '@react-navigation/native';
import { FontSize, Spacing } from '../utils/dimension';
import { COLORS } from '../utils/globalConstants/color';

export const CustomRatingInfo = ({ rating }: { rating: string }) => {
  const navigation = useNavigation();

  // Handler to navigate to the Reviews screen
  const handleNavigate = () => {
    navigation.navigate('Reviews');
  };

  return (
    <TouchableOpacity style={styles.ratingsContainer} onPress={handleNavigate}>
      <Icon name="star" size={FontSize.medium} color={COLORS.yellow} />
      <CustomText label={` ${rating}`} style={styles.ratingStyle} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  ratingsContainer: {
    backgroundColor: COLORS.green, // You may want to use a constant for green color
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.small,
    padding: Spacing.small / 2,
  },
  ratingStyle: {
    fontSize: FontSize.small,
    color: COLORS.white,
  },
});
