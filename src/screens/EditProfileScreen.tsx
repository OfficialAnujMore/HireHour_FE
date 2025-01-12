import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Text,
  ScrollView,
  Switch
} from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { Screen, Spacing } from '../utils/dimension';
import { COLORS } from '../utils/globalConstants/color';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { WORD_DIR } from '../utils/local/en';

const EditProfileScreen: React.FC = () => {
  // Common state for user data and errors
  const [user, setUser] = useState({
    name: '',
    username: '@Sabrina',
    email: 'SabrinaAry208@gmail.com',
    phone: '',
    profileImage: null as string | null, // Allowing both string and null,
    isServiceProviderEnrolled:false
    // const [isServiceProviderEnrolled, setIsServiceProviderEnrolled] = useState(false);

  });

  const [errors, setErrors] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    birth: '',
    gender: '',
  });

  // Handle profile image selection
  const handleImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 300,
        quality: 0.5,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.error('ImagePicker Error: ', response.errorMessage);
        } else {
          const uri = response.assets?.[0]?.uri;
          if (uri) setUser((prevState) => ({ ...prevState, profileImage: uri }));
        }
      }
    );
  };

  // Handle save action (e.g., update user profile)
  const handleSave = () => {
    console.log('Profile Saved:', user);
    // Here, you can perform the logic to save or update the user profile
  };

  // Handle change of profile fields
  const handleInputChange = (field: string, value: string|boolean) => {
    setUser((prevState) => ({ ...prevState, [field]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Image Section */}
      <View style={styles.imageWrapper}>
        <Image
          source={
            user.profileImage
              ? { uri: user.profileImage }
              : require('../assets/logo.jpeg') // Default profile image
          }
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editIcon} onPress={handleImagePicker}>
          <Icon name="pencil" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>


      {/* Input Fields */}
      <CustomInput
        label={WORD_DIR.name}
        value={user.name}
        onValueChange={(text) => handleInputChange('name', text)}
        placeholder="Enter last name"
        errorMessage={errors.name}
      />
      <CustomInput
        label="Username"
        value={user.username}
        onValueChange={(text) => handleInputChange('username', text)}
        placeholder="Enter username"
        disabled={true}
      />
      <CustomInput
        label="Email"
        value={user.email}
        onValueChange={(text) => handleInputChange('email', text)}
        placeholder="Enter email"
        keyboardType="email-address"
        disabled={true}
      />
      <CustomInput
        label="Phone Number"
        value={user.phone}
        onValueChange={(text) => handleInputChange('phone', text)}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        errorMessage={errors.phone}
      />

      {/* Save Button */}
      <CustomButton
        label="Save Profile"
        onPress={handleSave}
      // style={styles.saveButton}
      // textStyle={styles.buttonText}
      />

      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Enroll a Service Provider</Text>
        <Switch
          value={user.isServiceProviderEnrolled}

          onValueChange={(value) => handleInputChange('isServiceProviderEnrolled', value)}
          trackColor={{ true: COLORS.red, false: COLORS.grey }}
          thumbColor={user.isServiceProviderEnrolled ? COLORS.red : COLORS.white}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: Spacing.large,
    paddingTop: Spacing.extraLarge,
  },
  imageWrapper: {
    alignSelf: 'center',
    position: 'relative',
  },
  profileImage: {
    width: Screen.width / 4,
    height: Screen.width / 4,
    borderRadius: Screen.width / 8,
    borderWidth: 2,
    borderColor: COLORS.grey,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -5,
    backgroundColor: COLORS.grey,
    borderRadius: 15,
    padding: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: Spacing.large,
    marginBottom: Spacing.medium,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: Spacing.medium,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  saveButton: {
    marginTop: Spacing.extraLarge,
    backgroundColor: COLORS.red,
    borderRadius: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
