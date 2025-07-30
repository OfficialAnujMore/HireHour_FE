import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import CustomSnackbar from '../../components/CustomSnackbar';
import {Screen, Spacing} from '../../utils/dimension';
import {COLORS} from '../../utils/globalConstants/color';
import {WORD_DIR} from '../../utils/local/en';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {showSnackbar} from '../../redux/snackbarSlice';
import {RootState} from '../../redux/store';
import {globalStyle} from '../../utils/globalStyle';
import CustomAvatar from '../../components/CustomAvatar';
import {getErrorMessage} from '../../utils/errorHandler';

const EditProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const userdetails = useSelector((state: RootState) => state.auth.user);
  const [user, setUser] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    profileImage: null as string | null,
    isServiceProviderEnrolled: false,
  });

  // Initialize user state with actual user data
  useEffect(() => {
    if (userdetails) {
      setUser({
        name: `${userdetails.firstName || ''} ${
          userdetails.lastName || ''
        }`.trim(),
        username: userdetails.username || '',
        email: userdetails.email || '',
        phone: userdetails.phoneNumber || '',
        profileImage: userdetails.avatarUri || null,
        isServiceProviderEnrolled: Boolean(userdetails.isServiceProvider),
      });
    }
  }, [userdetails]);

  const [errors, setErrors] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    birth: '',
    gender: '',
  });
  {
    /* Disable edit icon for now */
  }
  // const handleImagePicker = async () => {
  //   // Check for photo library permission
  //   const permission = Platform.select({
  //     ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  //     android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  //   });

  //   if (!permission) return;

  //   // Check current permission status
  //   const status = await check(permission);

  //   if (status === RESULTS.GRANTED) {
  //     // Permission granted, proceed with image picker
  //     launchImageLibrary(
  //       {
  //         mediaType: 'photo',
  //         maxWidth: 300,
  //         maxHeight: 300,
  //         quality: 0.5,
  //       },
  //       response => {
  //         if (response.didCancel) {
  //           dispatch(
  //             showSnackbar({
  //               message: getErrorMessage(null, WORD_DIR.imageSelectionCanceled),
  //               success: true,
  //             }),
  //           );
  //         } else if (response.errorMessage) {
  //           dispatch(
  //             showSnackbar({
  //               message: getErrorMessage(
  //                 response,
  //                 'Image selection failed. Please try again.',
  //               ),
  //               success: false,
  //             }),
  //           );
  //         } else {
  //           const uri = response.assets?.[0]?.uri;
  //           if (uri) setUser(prevState => ({...prevState, profileImage: uri}));
  //         }
  //       },
  //     );
  //   } else {
  //     // Request permission if not granted
  //     const requestStatus = await request(permission);

  //     if (requestStatus === RESULTS.GRANTED) {
  //       // Permission granted, proceed with image picker
  //       launchImageLibrary(
  //         {
  //           mediaType: 'photo',
  //           maxWidth: 300,
  //           maxHeight: 300,
  //           quality: 0.5,
  //         },
  //         response => {
  //           if (response.didCancel) {
  //             dispatch(
  //               showSnackbar({
  //                 message: WORD_DIR.imageSelectionCanceled,
  //                 success: true,
  //               }),
  //             );
  //           } else if (response.errorMessage) {
  //             dispatch(
  //               showSnackbar({
  //                 message: getErrorMessage(
  //                   response,
  //                   'Image selection failed. Please try again.',
  //                 ),
  //                 success: false,
  //               }),
  //             );
  //           } else {
  //             const uri = response.assets?.[0]?.uri;
  //             if (uri)
  //               setUser(prevState => ({...prevState, profileImage: uri}));
  //           }
  //         },
  //       );
  //     } else {
  //       dispatch(
  //         showSnackbar({
  //           message: getErrorMessage(null, WORD_DIR.permissionRequired),
  //           success: false,
  //         }),
  //       );
  //     }
  //   }
  // };

  const handleSave = () => {
    if (!user.name.trim()) {
      dispatch(
        showSnackbar({
          message: getErrorMessage(null, WORD_DIR.nameRequired),
          success: false,
        }),
      );
      return;
    }
    dispatch(
      showSnackbar({
        message: getErrorMessage(null, WORD_DIR.profileSavedSuccess),
        success: true,
      }),
    );
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setUser(prevState => ({...prevState, [field]: value}));
  };

  return (
    <ScrollView style={globalStyle.globalContainer}>
      <CustomSnackbar />
      <View style={styles.imageWrapper}>
        <CustomAvatar
          name={user.name}
          imageUrl={user.profileImage || undefined}
          size={120}
          borderColor={COLORS.primary}
          borderWidth={4}
        />
        {/* Disable edit icon for now */}
        {/* <TouchableOpacity style={styles.editIcon} onPress={handleImagePicker}>
          <Icon name="pencil" size={18} color={COLORS.white} />
        </TouchableOpacity> */}
      </View>

      <CustomInput
        // label={WORD_DIR.name}
        value={user.name}
        onValueChange={text => handleInputChange('name', text)}
        placeholder={WORD_DIR.enterName}
        errorMessage={errors.name}
      />
      <CustomInput
        // label="Username"
        value={userdetails?.username || ''}
        placeholder={WORD_DIR.enterUsername}
        disabled={true}
      />
      <CustomInput
        // label="Email"
        value={userdetails?.email || ''}
        placeholder={WORD_DIR.enterEmail}
        keyboardType="email-address"
        disabled={true}
      />
      <CustomInput
        // label="Phone Number"
        value={user.phone}
        onValueChange={text => handleInputChange('phone', text)}
        placeholder={WORD_DIR.enterPhoneNumber}
        keyboardType="phone-pad"
        errorMessage={errors.phone}
      />

      <CustomButton
        label={WORD_DIR.saveProfile}
        onPress={handleSave}
        showLoader={true}
        loaderMessage="Saving profile..."
      />
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
    marginVertical: Spacing.large,
  },
  profileImage: {
    width: Screen.width / 4,
    height: Screen.width / 4,
    borderRadius: Screen.width / 8,
    borderWidth: 2,
    borderColor: COLORS.gray,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -5,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    padding: 5,
  },
});

export default EditProfileScreen;
