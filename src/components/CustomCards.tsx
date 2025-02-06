import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { COLORS } from '../utils/globalConstants/color';
import { FontSize, Screen, Spacing } from '../utils/dimension';
import CustomText from './CustomText';
import { useNavigation } from '@react-navigation/native';
import { CustomRatingInfo } from './CustomRatingInfo';
import Icon from 'react-native-vector-icons/Ionicons';
import { CustomCardsProps } from 'interfaces';


const CustomCards: React.FC<CustomCardsProps> = ({ item,handlePress }) => {
  const navigation = useNavigation();


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
          <CustomRatingInfo rating={item?.ratings} />
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

export default CustomCards;
