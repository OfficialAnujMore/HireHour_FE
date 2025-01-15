import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform
} from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import CustomSnackbar from '../../components/CustomSnackbar';
import { Screen, Spacing } from '../../utils/dimension';
import { COLORS } from '../../utils/globalConstants/color';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { WORD_DIR } from '../../utils/local/en';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../redux/snackbarSlice';

const EditProfileScreen: React.FC = () => {
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    name: '',
    username: '@Sabrina',
    email: 'SabrinaAry208@gmail.com',
    phone: '',
    profileImage: null as string | null,
    isServiceProviderEnrolled: false,
  });

  const [errors, setErrors] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    birth: '',
    gender: '',
  });

  const handleImagePicker = async () => {
    // Check for photo library permission
    const permission = Platform.select({
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
      android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    });

    if (!permission) return;

    // Check current permission status
    const status = await check(permission);

    if (status === RESULTS.GRANTED) {
      // Permission granted, proceed with image picker
      launchImageLibrary(
        {
          mediaType: 'photo',
          maxWidth: 300,
          maxHeight: 300,
          quality: 0.5,
        },
        (response) => {
          if (response.didCancel) {
            dispatch(showSnackbar('Image selection canceled.'));
          } else if (response.errorMessage) {
            dispatch(showSnackbar(`Error: ${response.errorMessage}`));
          } else {
            const uri = response.assets?.[0]?.uri;
            if (uri) setUser((prevState) => ({ ...prevState, profileImage: uri }));
          }
        }
      );
    } else {
      // Request permission if not granted
      const requestStatus = await request(permission);

      if (requestStatus === RESULTS.GRANTED) {
        // Permission granted, proceed with image picker
        launchImageLibrary(
          {
            mediaType: 'photo',
            maxWidth: 300,
            maxHeight: 300,
            quality: 0.5,
          },
          (response) => {
            if (response.didCancel) {
              dispatch(showSnackbar('Image selection canceled.'));
            } else if (response.errorMessage) {
              dispatch(showSnackbar(`Error: ${response.errorMessage}`));
            } else {
              const uri = response.assets?.[0]?.uri;
              if (uri) setUser((prevState) => ({ ...prevState, profileImage: uri }));
            }
          }
        );
      } else {
        // Permission denied, show an appropriate message
        dispatch(showSnackbar('Permission to access photos is required.'));
      }
    }
  };


  const handleSave = () => {
    if (!user.name.trim()) {
      dispatch(showSnackbar('Name is required.'));
      return;
    }
    console.log('Profile Saved:', user);
    dispatch(showSnackbar('Profile saved successfully!'));
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setUser((prevState) => ({ ...prevState, [field]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      <CustomSnackbar />
      <View style={styles.imageWrapper}>
        <Image
          source={
            user.profileImage
              ? { uri: user.profileImage }
              : require('../../assets/logo.jpeg')
          }
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editIcon} onPress={handleImagePicker}>
          <Icon name="pencil" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <CustomInput
        label={WORD_DIR.name}
        value={user.name}
        onValueChange={(text) => handleInputChange('name', text)}
        placeholder="Enter name"
        errorMessage={errors.name}
      />
      <CustomInput
        label="Username"
        value={user.username}
        placeholder="Enter username"
        disabled={true}
      />
      <CustomInput
        label="Email"
        value={user.email}
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

      <CustomButton label="Save Profile" onPress={handleSave} />
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

});

export default EditProfileScreen;