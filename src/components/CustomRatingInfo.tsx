import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomText from './CustomText';
import { useNavigation } from '@react-navigation/native';
import { FontSize, Spacing } from '../utils/dimension';
import { COLORS } from '../utils/globalConstants/color';
import * as Animatable from 'react-native-animatable';

export const CustomRatingInfo = ({ rating }: { rating: string }) => {
  const navigation = useNavigation();

  const handleNavigate = () => {
    // Small animation effect on press (optional)
    navigation.navigate('Reviews');
  };

  return (
    <TouchableWithoutFeedback onPress={handleNavigate}>
      <Animatable.View
        animation="fadeInRight"
        duration={600}
        easing="ease-out"
        style={styles.ratingsContainer}
      >
        <Animatable.View animation="pulse" iterationCount="infinite" duration={2000}>
          <Icon name="star" size={FontSize.medium} color={COLORS.warning} />
        </Animatable.View>
        <CustomText label={` ${rating}`} style={styles.ratingStyle} />
      </Animatable.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.success,
    borderRadius: 20,
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.small / 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingStyle: {
    fontSize: FontSize.small,
    color: COLORS.white,
    fontWeight: '600',
  },
});
