import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Screen, Spacing, FontSize } from "../../utils/dimension"; // Use your dimensions file
import { useDispatch } from "react-redux";
import { logout } from "../../redux/store";

interface Option {
  title: string;
  callback: () => void;
}

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const options: Option[] = [
    { title: "Edit Profile", callback: () => handleOptionPress("Edit Profile") },
    { title: "Security", callback: () => handleOptionPress("Security") },
    { title: "Notifications", callback: () => handleOptionPress("Notifications") },
    { title: "Privacy", callback: () => handleOptionPress("Privacy") },
    { title: "Help & Support", callback: () => handleOptionPress("Help & Support") },
    { title: "Terms and Policies", callback: () => handleOptionPress("Terms and Policies") },
    { title: "Free Up Space", callback: () => handleOptionPress("Free Up Space") },
    { title: "Data Saver", callback: () => handleOptionPress("Data Saver") },
    { title: "Log Out", callback: () => dispatch(logout()) },
  ];

  const handleOptionPress = (option: string) => {
    console.log(`${option} option selected`);
    // Implement actual callback logic for each option
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>
      {options.map((option, index) => (
        <TouchableOpacity key={index} style={styles.option} onPress={option.callback}>
          <Text style={styles.optionText}>{option.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.medium,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: FontSize.large,
    fontWeight: "bold",
    marginBottom: Spacing.medium,
  },

  option: {
    paddingVertical: Spacing.small,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  optionText: {
    fontSize: FontSize.medium,
    color: "#333",
  },
});

export default SettingsScreen;
