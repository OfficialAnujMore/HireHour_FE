
import React from 'react';
import { View, Text, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { FontSize, Spacing } from '../utils/dimension';
import { COLORS } from '../utils/globalConstants/color';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomText from './CustomText';
import { useNavigation } from '@react-navigation/native';
export const CustomRatingInfo = ({ rating }: { rating: string }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.ratingsContainer} onPress={() => {
      navigation.navigate("Reviews")
    }}>
      <Icon name="star" size={FontSize.medium} color={COLORS.yellow} />
      <CustomText label={` ${rating}`} style={[styles.ratingStyle]} />
    </TouchableOpacity>

  )
}

const styles = StyleSheet.create({
  ratingsContainer: {
    backgroundColor: "green",
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

})