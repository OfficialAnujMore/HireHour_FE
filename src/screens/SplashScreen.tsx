// SplashScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const SplashScreen = ({ onFinish }: { onFinish: (status:boolean) => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(true); // Trigger the navigation to home after the splash duration
    }, 3000); // 3 seconds splash screen duration

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
    backgroundColor: '#fff',
  },
  image: {
    width: 150,
    height: 150,
  },
  text: {
    fontSize: 20,
    color: '#000',
  },
});

export default SplashScreen;
