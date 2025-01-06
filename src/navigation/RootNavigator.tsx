import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import SplashScreen from '../screens/SplashScreen';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import LoginScreen from '../screens/LoginScreen'; // Fixed import path
import CustomSnackbar from '../components/CustomSnackbar';
import RegisterScreen from '../screens/RegisterScreen';
import ServiceDetailsScreen from '../screens/ServiceDetailsScreen';
import ServiceReviewScreen from '../screens/ServiceReviewsScreen';
import CreateServiceScreen from '../screens/CreateServiceScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // Handle splash screen finish
  const handleSplashFinish = (loginStatus: boolean) => {
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
              <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
              <Stack.Screen name="Reviews" component={ServiceReviewScreen} />
              <Stack.Screen name="CreateServiceScreen" component={CreateServiceScreen} />
              <Stack.Screen name="Details" component={DetailsScreen} />
            </>
          ) : (
            <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      )}
      <CustomSnackbar />
    </NavigationContainer>
  );
};

export default RootNavigator;
