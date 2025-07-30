import React from 'react';
import {View, StyleSheet, Image, ImageSourcePropType, SafeAreaView} from 'react-native';
import CustomText from './CustomText';
import CustomButton from './CustomButton';
import {FontSize, Screen, Spacing} from '../utils/dimension';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'interfaces';
import {COLORS} from '../utils/globalConstants/color';
import {globalStyle} from '../utils/globalStyle';
import defaultImage from '../assets/disconnected.png';

interface FallBackProps {
  imageSrc?: ImageSourcePropType;
  heading?: string;
  subHeading?: string;
  buttonLabel?: string;
  navigationRoute?: keyof RootStackParamList;
  showDefaultImage?: boolean;
}

export const FallBack: React.FC<FallBackProps> = ({
  imageSrc,
  heading = 'Something went wrong',
  subHeading = 'We encountered an unexpected error. Please try again.',
  buttonLabel = 'Go Back',
  navigationRoute = '',
  showDefaultImage = true,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleButtonPress = () => {
    if (navigationRoute === 'Home') {
      // Navigate to Tabs with Home screen parameter
      navigation.navigate('Tabs', { screen: 'Home' });
    } else {
      navigation.navigate(navigationRoute as any);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.fallBackContainer, globalStyle.globalContainer]}>
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            {(imageSrc || showDefaultImage) && (
              <Image
                source={imageSrc || defaultImage}
                style={styles.fallBackImage}
                resizeMode="contain"
              />
            )}
          </View>
          
          <View style={styles.textContainer}>
            {heading && (
              <CustomText
                style={styles.headingText}
                label={heading}
                numberOfLines={2}
              />
            )}
            {subHeading && (
              <CustomText
                style={styles.subHeadingText}
                label={subHeading}
                numberOfLines={3}
              />
            )}
          </View>
        </View>
        
        {navigationRoute && (
          <View style={styles.buttonContainer}>
            <CustomButton
              label={buttonLabel}
              onPress={handleButtonPress}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  fallBackContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.medium,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.large,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.large,
    width: '100%',
  },
  fallBackImage: {
    width: Screen.width * 0.6,
    height: Screen.height * 0.3,
    maxWidth: 300,
    maxHeight: 250,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.medium,
    width: '100%',
  },
  headingText: {
    fontSize: FontSize.large,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.small,
    color: COLORS.black,
    lineHeight: FontSize.large * 1.3,
  },
  subHeadingText: {
    fontSize: FontSize.medium,
    textAlign: 'center',
    color: COLORS.gray,
    lineHeight: FontSize.medium * 1.4,
    paddingHorizontal: Spacing.small,
  },
  buttonContainer: {
    paddingBottom: Spacing.large,
    paddingHorizontal: Spacing.small,
  },
});
