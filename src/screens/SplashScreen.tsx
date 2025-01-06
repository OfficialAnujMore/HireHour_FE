// SplashScreen.tsx
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { RootState } from '../redux/store';
import { COLOR } from '../utils/globalConstants/color';
import { FontSize, Screen } from '../utils/dimension';

const SplashScreen = ({ onFinish }: { onFinish: (status:boolean) => void }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(true); // Trigger the navigation to home after the splash duration
    }, 500); // 3 seconds splash screen duration

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.jpeg')} style={styles.image} />
      <Text style={styles.text}>Welcome to the App!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.white,
  },
  image: {
    resizeMode:'contain',
    width: Screen.width,
    height: Screen.height *0.4,
  },
  text: {
    fontSize: FontSize.extraLarge,
    color: COLOR.black,
  },
});

export default SplashScreen;
