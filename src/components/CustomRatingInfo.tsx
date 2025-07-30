import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomText from './CustomText';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'interfaces';
import {FontSize, Spacing} from '../utils/dimension';
import {COLORS} from '../utils/globalConstants/color';

interface CustomRatingInfoProps {
  rating: number | string;
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
  clickable?: boolean;
}

export const CustomRatingInfo: React.FC<CustomRatingInfoProps> = ({
  rating,
  showText = true,
  size = 'medium',
  clickable = true,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleNavigate = () => {
    if (clickable) {
      navigation.navigate('Reviews');
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 20;
      default:
        return 16;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return FontSize.small - 2;
      case 'large':
        return FontSize.medium;
      default:
        return FontSize.small;
    }
  };

  const renderStars = () => {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon
          key={`full-${i}`}
          name="star"
          size={getIconSize()}
          color={COLORS.primary}
          style={styles.star}
        />,
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <Icon
          key="half"
          name="star-half"
          size={getIconSize()}
          color={COLORS.primary}
          style={styles.star}
        />,
      );
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon
          key={`empty-${i}`}
          name="star-outline"
          size={getIconSize()}
          color={COLORS.lightGray}
          style={styles.star}
        />,
      );
    }

    return stars;
  };

  const Component = clickable ? TouchableOpacity : View;

  return (
    <Component
      onPress={handleNavigate}
      style={styles.container}
      activeOpacity={clickable ? 0.7 : 1}>
      <View style={styles.starsContainer}>{renderStars()}</View>
      {showText && (
        <CustomText
          label={`${rating}`}
          style={[styles.ratingText, {fontSize: getTextSize()}]}
        />
      )}
    </Component>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 1,
  },
  ratingText: {
    color: COLORS.gray,
    fontWeight: '500',
  },
});
