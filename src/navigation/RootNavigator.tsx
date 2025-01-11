import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, GestureResponderEvent } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

// Screens
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ServiceDetailsScreen from "../screens/ServiceDetailsScreen";
import ServiceReviewScreen from "../screens/ServiceReviewsScreen";
import CreateServiceScreen from "../screens/CreateServiceScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import DetailsScreen from "../screens/DetailsScreen";
import EditProfileScreen from "../screens/EditProfileScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

interface CustomTabBarButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
}

const CustomTabBarButton: React.FC<CustomTabBarButtonProps> = ({ onPress }) => (
  <TouchableOpacity
    style={styles.customButton}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Icon name="add" size={25} color="#fff" />
  </TouchableOpacity>
);

const AuthenticatedTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "home";

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Details") {
            iconName = "list-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline";
          } else if (route.name === "Settings") {
            iconName = "settings-outline";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#6200ee",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
        tabBarStyle: styles.tabBarStyle,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Details" component={DetailsScreen} />
      <Tab.Screen
        name="Create"
        component={CreateServiceScreen}
        options={{
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
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
              <Stack.Screen
                name="CreateServiceScreen"
                component={CreateServiceScreen}
              />
              <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
            />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: "#fff",
    height: 70,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: "absolute",
    overflow: "hidden",
  },
  customButton: {
    backgroundColor: "#6200ee",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
});

export default RootNavigator;
