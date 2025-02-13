import React from 'react';
import {View, Text, Button, Alert, StyleSheet, Image} from 'react-native';
import CustomText from './CustomText';
import CustomButton from './CustomButton';
import {FontSize, Screen, Spacing} from '../utils/dimension';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../utils/globalConstants/color';
import {globalStyle} from '../utils/globalStyle';
import defaultImage from '../assets/disconnected.png';

export const FallBack = ({
  imageSrc = defaultImage,
  heading = '',
  subHeading = '',
  buttonLabel = '',
  navigationRoute = 'Home',
}) => {
  const navigation = useNavigation();
  const safeNavigationRoute = navigationRoute ?? 'DefaultScreen';

  return (
    <View style={[styles.fallBackContainer, globalStyle.globalContainer]}>
      <View style={styles.detailsContaier}>
        <View style={{alignItems: 'center'}}>
          <Image source={imageSrc} style={styles.fallBackImage} />
          <CustomText style={styles.emptyText} label={heading} />
          <CustomText style={styles.emptyText} label={subHeading} />
        </View>
      </View>
      {buttonLabel && (
        <CustomButton
          label={buttonLabel}
          onPress={() => {
            navigation.navigate(safeNavigationRoute);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fallBackContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.small,
  },
  detailsContaier: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: FontSize.medium,
    textAlign: 'center',
    marginTop: Spacing.small,
    color: COLORS.gray,
  },
  fallBackImage: {
    objectFit: 'contain',
    width: Screen.width,
    height: Screen.height / 2,
  },
});
