import React, { useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const CustomSlider = () => {
  const [slideAnim] = useState(new Animated.Value(0));
  const [paid, setPaid] = useState(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      { dx: slideAnim }
    ], { useNativeDriver: false }),
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > 200) {
        setPaid(true);
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 300,
          useNativeDriver: false
        }).start();
      } else {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false
        }).start();
      }
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.offerText}>Save ₹72 more on this order!</Text>
      <Text style={styles.description}>Get free delivery and up to 35% off on eligible restaurants with Swiggy ONE</Text>
      <Text style={styles.paymentText}>Pay using Google Pay</Text>
      <View style={styles.sliderContainer}>
        <Animated.View
          style={[styles.slider, { transform: [{ translateX: slideAnim }] }]}
          {...panResponder.panHandlers}
        >
          <Ionicons name="chevron-forward" size={24} color="white" />
        </Animated.View>
        <Text style={styles.sliderText}>{paid ? 'Payment Successful!' : 'Slide to pay | ₹220'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  offerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6600',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  sliderContainer: {
    width: 300,
    height: 50,
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  slider: {
    width: 50,
    height: 50,
    backgroundColor: 'green',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
  },
  sliderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  }
});

export default CustomSlider;
