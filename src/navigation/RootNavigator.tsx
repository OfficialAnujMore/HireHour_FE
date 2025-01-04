import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import SplashScreen from '../screens/SplashScreen';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import LoginScreen from '../screens/LoginScreen'; // Fixed import path

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // Handle splash screen finish
  const handleSplashFinish = (loginStatus: boolean) => {
    console.log('isAuthenticated:', isAuthenticated);
    setIsLoading(false);
  };

  return (
    <NavigationContainer>
      {isLoading ? (
        // Show SplashScreen initially
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        // Show normal stack navigation after splash is finished
        <Stack.Navigator initialRouteName={isAuthenticated ? "Home" : "Login"}>
          {isAuthenticated ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Details" component={DetailsScreen} />
            </>
          ) : (
            <Stack.Screen name="Login" component={LoginScreen} />
          )}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
