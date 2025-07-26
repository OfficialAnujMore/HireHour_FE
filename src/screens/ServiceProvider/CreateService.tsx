import React, {useState} from 'react';
import {StyleSheet, ScrollView, Platform, Alert} from 'react-native';
import {FontSize, Screen, Spacing} from '../../utils/dimension';
import CustomText from '../../components/CustomText';
import {WORD_DIR} from '../../utils/local/en';
import {COLORS} from '../../utils/globalConstants/color';
import CustomButton from '../../components/CustomButton';
import {useDispatch} from 'react-redux';
import CustomDropdown from '../../components/CustomDropdown';
import {CATEGORY, MAX_FIELD_CHAR_COUNT} from '../../utils/constants';
import {useNavigation} from '@react-navigation/native';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import CustomCarousel from '../../components/CustomCarousel';
import {showSnackbar} from '../../redux/snackbarSlice';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {globalStyle} from '../../utils/globalStyle';
import renderInput from '../../utils/renderInputUtil';
import InteractiveButton from '../../components/ExpandableUploadButton';
import ExpandableUploadButton from '../../components/ExpandableUploadButton';

const CreateService = (props: any) => {
  const initialServiceDetails = props.route.params || {};

  const [serviceDetails, setServiceDetails] = useState({
    title: '',
    description: '',
    pricing: '',
    category: CATEGORY[Object.keys(CATEGORY)[0] as keyof typeof CATEGORY],
    servicePreview: [] as any[],
    ...(initialServiceDetails || {}),
  });

  const dispatch = useDispatch();
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    pricing: '',
    servicePreview: '',
  });

  const navigation = useNavigation();

  const validateFields = () => {
    const newErrors = {
      title: '',
      description: '',
      pricing: '',
      servicePreview: '',
    };
    let valid = true;

    if (!serviceDetails.title) {
      newErrors.title = 'Title is required';
      valid = false;
    }
    if (!serviceDetails.description) {
      newErrors.description = 'Description is required';
      valid = false;
    }
    if (!serviceDetails.pricing) {
      newErrors.pricing = 'Pricing is required';
      valid = false;
    }
    if (serviceDetails.servicePreview.length === 0) {
      dispatch(
        showSnackbar({
          message: 'Please select at least one image',
        }),
      );
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleImagePicker = async () => {
    if (Platform.OS === 'android') {
      const permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
      const permissionStatus = await check(permission);

      if (permissionStatus === RESULTS.GRANTED) {
        openImagePicker();
      } else {
        const requestResult = await request(permission);
        if (requestResult === RESULTS.GRANTED) {
          openImagePicker();
        } else {
          Alert.alert(
            'Permission Denied',
            'You need to allow access to your gallery.',
          );
        }
      }
    } else if (Platform.OS === 'ios') {
      const permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
      const permissionStatus = await check(permission);

      if (permissionStatus === RESULTS.GRANTED) {
        openImagePicker();
      } else {
        const requestResult = await request(permission);
        if (requestResult === RESULTS.GRANTED) {
          openImagePicker();
        } else {
          Alert.alert(
            'Permission Denied',
            'You need to allow access to your gallery.',
          );
        }
      }
    }
  };

  const openImagePicker = () => {
    launchImageLibrary(
      {mediaType: 'photo', selectionLimit: 5},
      (response: ImagePickerResponse) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
          return;
        }
        if (response.assets && response.assets.length > 0) {
          setServiceDetails(prev => ({
            ...prev,
            servicePreview: response.assets,
          }));
        }
      },
    );
  };

  const handleValueChange = (field: any, value: string): void => {
    setServiceDetails(prev => ({...prev, [field]: value}));
  };

  return (
    <ScrollView style={globalStyle.globalContainer}>
      <CustomText label={WORD_DIR.serviceDetails} style={styles.heading} />
      {serviceDetails.servicePreview.length > 0 && (
        <CustomCarousel data={serviceDetails.servicePreview} />
      )}

      <ExpandableUploadButton
        icon="cloud-upload-outline"
        label="Upload Photos"
        onTrigger={handleImagePicker}
      />
      {renderInput({
        value: serviceDetails.title,
        placeholder: WORD_DIR.title,
        field: 'title',
        maxLength: MAX_FIELD_CHAR_COUNT.serviceTitle,
        errors,
        handleValueChange,
      })}

      {renderInput({
        value: serviceDetails.description,
        placeholder: WORD_DIR.description,
        field: 'description',
        maxLength: MAX_FIELD_CHAR_COUNT.serviceDescription,
        errors,
        handleValueChange,
      })}

      {renderInput({
        value: serviceDetails.pricing,
        placeholder: WORD_DIR.pricing,
        field: 'pricing',
        maxLength: 3,
        errors,
        handleValueChange,
        keyboardType: 'phone-pad',
      })}
      <CustomDropdown
        label="Select a Category"
        options={CATEGORY}
        value={serviceDetails.category}
        onValueChange={value =>
          setServiceDetails(prev => ({...prev, category: value}))
        }
      />

      <CustomButton
        onPress={() => {
          if (validateFields()) {
            navigation.navigate('Create Schedule', serviceDetails);
          }
        }}
        label={WORD_DIR.next}
      />
    </ScrollView>
  );
};

// styles remain the same

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.medium,
    backgroundColor: COLORS.white,
  },
  heading: {
    fontSize: FontSize.large,
    fontWeight: 'bold',
    marginVertical: Spacing.small,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: Spacing.small,
  },
});

export default CreateService;
