import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, GestureResponderEvent, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

// Screens
import SplashScreen from "../screens/User/SplashScreen";
import HomeScreen from "../screens/User/HomeScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import ServiceDetailsScreen from "../screens/ServiceProvider/ServiceDetailsScreen";
import ServiceReviewScreen from "../screens/ServiceProvider/ServiceReviewsScreen";
import CreateServiceScreen from "../screens/ServiceProvider/CreateServiceScreen";
import ProfileScreen from "../screens/User/ProfileScreen";
import SettingsScreen from "../screens/User/SettingsScreen";
import DetailsScreen from "../screens/DetailsScreen";
import EditProfileScreen from "../screens/User/EditProfileScreen";
import SummaryScreen from "../screens/ServiceProvider/SummaryScreen";
import { FontSize, Screen } from "../utils/dimension";
import { COLORS } from "../utils/globalConstants/color";
import EnrollAsServiceProvider from "../screens/ServiceProvider/EnrollAsServiceProvider";
import ViewServiceScreen from "../screens/ServiceProvider/ViewServiceScreen";
import MyServices from "../screens/ServiceProvider/MyService";
import UpcomingEvents from "../screens/UpcomingEvents";
import RegistrationScreen from "../screens/Auth/RegistrationScreen";
import VerifyOTPScreen from "../screens/Auth/VerifyOTPScreen";
// import VerifyOtpScreen from "../screens/Auth/VerifyOtpScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();



const CustomTabBarButton: React.FC<CustomTabBarButtonProps> = ({ onPress }) => (
  <TouchableOpacity
    style={styles.customButton}
    onPress={onPress}
  >
    <Icon name="add" size={Screen.moderateScale(30)} color={COLORS.primary} />
  </TouchableOpacity>
);

const AuthenticatedTabs = () => {
  const user = useSelector(
    (state: RootState) => state.auth.user
  );
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let iconName = "home";

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Events") {
            iconName = "calendar-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline";
          } else if (route.name === "Cart") {
            iconName = "cart-outline";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.secondary,
        tabBarInactiveTintColor: COLORS.ternary,
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
        tabBarLabel: ({ focused }: { focused: boolean }) => (
          <Text
            style={{
              fontWeight: focused ? "bold" : "normal",
              fontSize: FontSize.small,
              color: focused ? COLORS.secondary : COLORS.ternary,
            }}
          >
            {route.name}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Events" component={UpcomingEvents} />
      {
        user?.isServiceProvider ?

          <Tab.Screen
            name="Create"
            component={CreateServiceScreen}
            options={{
              tabBarButton: (props) => <CustomTabBarButton {...props} />,
            }}
          />
          : null
      }
      <Tab.Screen name="Cart" component={SummaryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>

  );
};

const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
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
        <Stack.Navigator initialRouteName={isAuthenticated ? "Tabs" : "Login"}>
          {isAuthenticated ? (
            <>
              <Stack.Screen
                name="Tabs"
                component={AuthenticatedTabs}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ServiceDetails"
                component={ServiceDetailsScreen}
              />
              <Stack.Screen name="Reviews" component={ServiceReviewScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="Enroll" component={EnrollAsServiceProvider} />
              <Stack.Screen name="MyService" component={MyServices} />
              <Stack.Screen name="ViewService" component={ViewServiceScreen} />


              <Stack.Screen
                name="CreateServiceScreen"
                component={CreateServiceScreen}
              />
              <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
              />
              <Stack.Screen
                name="Summary"
                component={SummaryScreen}
              />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />
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
    justifyContent: 'space-between'
  },
  customButton: {
    backgroundColor: COLORS.secondary,
    width: Screen.moderateScale(60),
    height: Screen.moderateScale(60),
    borderRadius: Screen.moderateScale(50),
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RootNavigator;
