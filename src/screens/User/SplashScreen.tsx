import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {COLORS} from '../../utils/globalConstants/color';
import {FontSize, Screen} from '../../utils/dimension';
import {WORD_DIR} from '../../utils/local/en';
import {globalStyle} from '../../utils/globalStyle';
import CustomText from '../../components/CustomText';

const SplashScreen = ({onFinish}: {onFinish: (status: boolean) => void}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.jpeg')} style={styles.image} />
      <CustomText style={styles.text} label={WORD_DIR.welcomeMsg} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  image: {
    resizeMode: 'contain',
    width: Screen.width,
    height: Screen.height * 0.4,
  },
  text: {
    fontSize: FontSize.extraLarge,
    color: COLORS.black,
    fontWeight: '500',
    alignSelf: 'center',
  },
});

export default SplashScreen;
