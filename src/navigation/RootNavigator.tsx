// RootNavigator.tsx
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import SplashScreen from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Handle splash screen finish
  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  return (
    <NavigationContainer>
      {isLoading ? (
        // Show SplashScreen initially
        <SplashScreen onFinish={(item)=>{
          console.log('Item', item);
          
          handleSplashFinish()}} />
      ) : (
        // Show normal stack navigation after splash is finished
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
