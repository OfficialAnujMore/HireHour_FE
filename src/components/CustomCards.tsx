import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { COLORS } from '../utils/globalConstants/color';
import { FontSize, Screen, Spacing } from '../utils/dimension';
import CustomText from './CustomText';
import { useNavigation } from '@react-navigation/native';
import { CustomRatingInfo } from './CustomRatingInfo';

interface CustomCardsProps {
  item: {
    profileImageURL?: string;
    title: string;
    description: string;
    category: string;
    chargesPerHour: string;
    rating: number;
  };
}

const CustomCards: React.FC<CustomCardsProps> = ({ item }) => {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate("ServiceDetails", item);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image 
        source={{ uri: item.profileImageURL ?? '' }} 
        style={styles.image} 
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <CustomText label={item.title} style={styles.textStyle} />
          <CustomRatingInfo rating={item?.rating?.toString()} />
        </View>
        <CustomText label={item.description} style={styles.textStyle} />
        <CustomText label={item.category} style={styles.textStyle} />
        <CustomText label={item.chargesPerHour} style={styles.textStyle} />
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
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  textStyle: {
    fontSize: FontSize.medium,
    fontWeight: '400',
  },
  image: {
    width: Screen.width * 0.25,
    height: Screen.width * 0.25,
    borderRadius: Spacing.small,
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

export default CustomCards;
