import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Screen, Spacing, FontSize } from "../utils/dimension"; // Use your dimensions file

const SettingsScreen = () => {
  const options = [
    "Edit Profile",
    "Security",
    "Notifications",
    "Privacy",
    "Help & Support",
    "Terms and Policies",
    "Free Up Space",
    "Data Saver",
    "Log Out",
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>
      {options.map((option, index) => (
        <TouchableOpacity key={index} style={styles.option}>
          <Text style={styles.optionText}>{option}</Text>
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