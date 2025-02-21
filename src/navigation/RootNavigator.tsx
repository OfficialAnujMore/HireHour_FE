import React, {useState} from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';

// Screens
import SplashScreen from '../screens/User/SplashScreen';
import HomeScreen from '../screens/User/HomeScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import ServiceDetailsScreen from '../screens/ServiceProvider/ServiceDetailsScreen';
import ServiceReviewScreen from '../screens/ServiceProvider/ServiceReviewsScreen';
import ProfileScreen from '../screens/User/ProfileScreen';
import SettingsScreen from '../screens/User/SettingsScreen';
import EditProfileScreen from '../screens/User/EditProfileScreen';
import {FontSize, Screen, Spacing} from '../utils/dimension';
import {COLORS} from '../utils/globalConstants/color';
import EnrollAsServiceProvider from '../screens/ServiceProvider/EnrollAsServiceProvider';
import ViewServiceScreen from '../screens/ServiceProvider/ViewServiceScreen';
import MyServices from '../screens/ServiceProvider/MyService';
import UpcomingEvents from '../screens/UpcomingEvents';
import RegistrationScreen from '../screens/Auth/RegistrationScreen';
import VerifyOTPScreen from '../screens/Auth/VerifyOTPScreen';
import CreateSchedule from '../screens/ServiceProvider/CreateSchedule';
import CreateService from '../screens/ServiceProvider/CreateService';
import {CartScreen} from '../screens/ServiceProvider/CartScreen';
import {TransactionHistory} from '../screens/ServiceProvider/TransactionHistory';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CustomTabBarButton: React.FC<CustomTabBarButtonProps> = ({onPress}) => (
  <TouchableOpacity style={styles.customButton} onPress={onPress}>
    <Icon name="add" size={Screen.moderateScale(30)} color={COLORS.primary} />
  </TouchableOpacity>
);

const AuthenticatedTabs = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}: {color: string; size: number}) => {
          let iconName = 'home';

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Events') {
            iconName = 'calendar-outline';
          } else if (route.name === 'Cart') {
            iconName = 'cart-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: COLORS.black,
        headerShown: false,
        tabBarStyle: [styles.tabBarStyle],
        tabBarLabel: ({focused}: {focused: boolean}) => (
          <Text
            style={{
              fontWeight: focused ? 'bold' : 'normal',
              fontSize: FontSize.small,
              color: focused ? COLORS.secondary : COLORS.black,
            }}>
            {route.name}
          </Text>
        ),
        safeAreaInsets: {bottom: Screen.height},
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Events" component={UpcomingEvents} />
      {user?.isServiceProvider ? (
        <Tab.Screen
          name="Create Service"
          component={CreateService}
          options={{
            tabBarButton: props => <CustomTabBarButton {...props} />,
          }}
        />
      ) : null}
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  // Handle splash screen finish
  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  return (
    <NavigationContainer>
      {isLoading ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <Stack.Navigator initialRouteName={isAuthenticated ? 'Tabs' : 'Login'}>
          {isAuthenticated ? (
            <>
              <Stack.Screen
                name="Tabs"
                component={AuthenticatedTabs}
                options={{headerShown: false}}
              />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen
                name="Service Details"
                component={ServiceDetailsScreen}
              />
              <Stack.Screen name="Reviews" component={ServiceReviewScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen
                name="Enrollment"
                component={EnrollAsServiceProvider}
              />
              <Stack.Screen name="MyService" component={MyServices} />
              <Stack.Screen name="ViewService" component={ViewServiceScreen} />

              <Stack.Screen name="Create Service" component={CreateService} />
              <Stack.Screen name="Create Schedule" component={CreateSchedule} />
              <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
              <Stack.Screen name="Cart" component={CartScreen} />
              <Stack.Screen
                name="Transaction History"
                component={TransactionHistory}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen
                name="RegistrationScreen"
                component={RegistrationScreen}
              />
              <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
            </>
          )}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: COLORS.primary,
    height: Screen.height / 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: 'center',
    alignContent: 'center',
    paddingTop: Spacing.small,
    paddingBottom: Spacing.medium, // Prevents text/icons from sticking to the bottom
  },
  customButton: {
    backgroundColor: COLORS.secondary,
    width: Screen.moderateScale(60),
    height: Screen.moderateScale(60),
    borderRadius: Screen.moderateScale(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RootNavigator;
