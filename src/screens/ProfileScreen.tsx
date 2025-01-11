import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import CustomButton from '../components/CustomButton';
import { Screen, Spacing, FontSize } from '../utils/dimension';
import { COLOR } from '../utils/globalConstants/color';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen: React.FC = () => {    const navigation = useNavigation()
  const handleEditProfile = () => {
    navigation.navigate("EditProfile")
    console.log('Edit Profile Pressed');
  };

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={require('../assets/logo.jpeg')} // Replace with your profile picture path
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>John Doe</Text>
        <Text style={styles.profileEmail}>johndoe@example.com</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <CustomButton
          label="Edit Profile"
          onPress={handleEditProfile}
          style={styles.editButton}
        />
        <CustomButton
          label="Logout"
          onPress={() => console.log('Logout Pressed')}
          style={styles.logoutButton}
          textStyle={{ color: COLOR.red }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
    paddingHorizontal: Spacing.large,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.large,
  },
  profileImage: {
    width: Screen.width / 3,
    height: Screen.width / 3,
    borderRadius: Screen.width / 6,
    marginBottom: Spacing.medium,
  },
  profileName: {
    fontSize: FontSize.large,
    fontWeight: 'bold',
    color: COLOR.black,
  },
  profileEmail: {
    fontSize: FontSize.medium,
    color: COLOR.grey,
  },
  buttonContainer: {
    marginTop: Spacing.large,
  },
  editButton: {
    backgroundColor: COLOR.red,
    marginBottom: Spacing.medium,
  },
  logoutButton: {
    backgroundColor: COLOR.lightGrey,
  },
});

export default ProfileScreen;
