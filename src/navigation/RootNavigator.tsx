import React, {useState, useCallback, useMemo} from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {selectIsAuthenticated, selectUser} from '../redux/selectors';
import {CustomTabBarButtonProps} from '../interfaces/interface';

// Lazy load screens for better performance
const SplashScreen = React.lazy(() => import('../screens/User/SplashScreen'));
const HomeScreen = React.lazy(() => import('../screens/User/HomeScreen'));
const LoginScreen = React.lazy(() => import('../screens/Auth/LoginScreen'));
const ServiceDetailsScreen = React.lazy(
  () => import('../screens/ServiceProvider/ServiceDetailsScreen'),
) as React.LazyExoticComponent<React.ComponentType<any>>;
const ServiceReviewScreen = React.lazy(
  () => import('../screens/ServiceProvider/ServiceReviewsScreen'),
);
const ProfileScreen = React.lazy(() => import('../screens/User/ProfileScreen'));
const SettingsScreen = React.lazy(
  () => import('../screens/User/SettingsScreen'),
);
const EditProfileScreen = React.lazy(
  () => import('../screens/User/EditProfileScreen'),
);
const EnrollAsServiceProvider = React.lazy(
  () => import('../screens/ServiceProvider/EnrollAsServiceProvider'),
);
const ViewServiceScreen = React.lazy(
  () => import('../screens/ServiceProvider/ViewServiceScreen'),
);
const MyServices = React.lazy(
  () => import('../screens/ServiceProvider/MyService'),
);
const UpcomingEvents = React.lazy(() => import('../screens/UpcomingEvents'));
const RegistrationScreen = React.lazy(
  () => import('../screens/Auth/RegistrationScreen'),
);
const VerifyOTPScreen = React.lazy(
  () => import('../screens/Auth/VerifyOTPScreen'),
) as React.LazyExoticComponent<React.ComponentType<any>>;
const CreateSchedule = React.lazy(
  () => import('../screens/ServiceProvider/CreateSchedule'),
);
const CreateService = React.lazy(
  () => import('../screens/ServiceProvider/CreateService'),
);
const CartScreen = React.lazy(
  () => import('../screens/ServiceProvider/CartScreen'),
);
const TransactionHistory = React.lazy(
  () => import('../screens/ServiceProvider/TransactionHistory'),
);
const EventOverviewScreen = React.lazy(
  () => import('../screens/ServiceProvider/EventOverviewScreen'),
);

import {FontSize, Screen, Spacing} from '../utils/dimension';
import {COLORS} from '../utils/globalConstants/color';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Loading component for lazy-loaded screens
const ScreenLoader = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>Loading...</Text>
  </View>
);

const CustomTabBarButton: React.FC<CustomTabBarButtonProps> = React.memo(
  ({onPress}) => (
    <TouchableOpacity style={styles.customButton} onPress={onPress}>
      <Icon name="add" size={Screen.moderateScale(30)} color={COLORS.primary} />
    </TouchableOpacity>
  ),
);

CustomTabBarButton.displayName = 'CustomTabBarButton';

const AuthenticatedTabs = React.memo(() => {
  const user = useSelector(selectUser);

  const screenOptions = useMemo(
    () =>
      ({route}: {route: any}) => ({
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
              fontSize: focused ? FontSize.small + 2 : FontSize.small,
              color: focused ? COLORS.white : COLORS.black,
            }}>
            {route.name}
          </Text>
        ),
        safeAreaInsets: {bottom: Screen.height},
      }),
    [],
  );

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          lazy: true,
        }}
      />
      <Tab.Screen
        name="Events"
        component={UpcomingEvents}
        options={{
          lazy: true,
        }}
      />
      {user?.isServiceProvider ? (
        <Tab.Screen
          name="Create Service"
          component={CreateService}
          options={{
            tabBarButton: props => <CustomTabBarButton {...props} />,
            lazy: true,
          }}
        />
      ) : null}
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          lazy: true,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          lazy: true,
        }}
      />
    </Tab.Navigator>
  );
});

AuthenticatedTabs.displayName = 'AuthenticatedTabs';

const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Handle splash screen finish
  const handleSplashFinish = useCallback(() => {
    setIsLoading(false);
  }, []);

  const stackScreenOptions = useMemo(
    () => ({
      headerShown: false,
    }),
    [],
  );

  const authenticatedScreens = useMemo(
    () => (
      <>
        <Stack.Screen name="Tabs" component={AuthenticatedTabs} />
        <Stack.Screen name="Service Details" component={ServiceDetailsScreen} />
        <Stack.Screen name="Reviews" component={ServiceReviewScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Enrollment" component={EnrollAsServiceProvider} />
        <Stack.Screen name="MyService" component={MyServices} />
        <Stack.Screen
          name="BookedEvents"
          component={EventOverviewScreen}
          initialParams={{type: 'Booked'}}
        />
        <Stack.Screen
          name="UpcomingEvents"
          component={EventOverviewScreen}
          initialParams={{type: 'Upcoming'}}
        />
        <Stack.Screen
          name="PastEvents"
          component={EventOverviewScreen}
          initialParams={{type: 'Past'}}
        />
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
    ),
    [],
  );

  const unauthenticatedScreens = useMemo(
    () => (
      <>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="RegistrationScreen"
          component={RegistrationScreen}
        />
        <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
      </>
    ),
    [],
  );

  return (
    <NavigationContainer>
      <React.Suspense fallback={<ScreenLoader />}>
        {isLoading ? (
          <SplashScreen onFinish={handleSplashFinish} />
        ) : (
          <Stack.Navigator
            initialRouteName={isAuthenticated ? 'Tabs' : 'Login'}
            screenOptions={stackScreenOptions}>
            {isAuthenticated ? authenticatedScreens : unauthenticatedScreens}
          </Stack.Navigator>
        )}
      </React.Suspense>
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
    paddingBottom: Spacing.medium,
  },
  customButton: {
    backgroundColor: COLORS.white,
    width: Screen.moderateScale(60),
    height: Screen.moderateScale(60),
    borderRadius: Screen.moderateScale(50),
    borderWidth: 5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginHorizontal: 'auto',
    marginBottom: Spacing.medium,
  },
});

export default RootNavigator;
