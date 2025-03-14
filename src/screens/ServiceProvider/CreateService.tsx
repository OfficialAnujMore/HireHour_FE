import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, View, Platform, Alert} from 'react-native';
import {FontSize, Spacing} from '../../utils/dimension';
import CustomText from '../../components/CustomText';
import CustomInput from '../../components/CustomInput';
import {WORD_DIR} from '../../utils/local/en';
import {COLORS} from '../../utils/globalConstants/color';
import CustomButton from '../../components/CustomButton';
import {RootState} from 'redux/store';
import {useDispatch, useSelector} from 'react-redux';
import CustomDropdown from '../../components/CustomDropdown';
import {CATEGORY} from '../../utils/constants';
import {useNavigation} from '@react-navigation/native';
import {
  Asset,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import CustomCarousel from '../../components/CustomCarousel';
import {showSnackbar} from '../../redux/snackbarSlice';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {globalStyle} from '../../utils/globalStyle';

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
      newErrors.pricing = 'Charges per hour is required';
      valid = false;
    }
    if (serviceDetails.servicePreview.length === 0) {
      newErrors.servicePreview = 'Please select at least one image';
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
          setServiceDetails(prev => ({...prev, servicePreview: response.assets}));
        }
      },
    );
  };

  const renderInput = (
    label: string,
    value: string,
    placeholder: string,
    field: keyof typeof serviceDetails,
    errorMessage: string,
    maxLength?: number,
    keyboardType?: 'default' | 'email-address' | 'phone-pad',
    secureTextEntry?: boolean,
  ) => (
    <CustomInput
      label={label}
      value={value}
      placeholder={placeholder}
      onValueChange={value =>
        setServiceDetails(prev => ({...prev, [field]: value}))
      }
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      errorMessage={errorMessage}
      maxLength={maxLength}
    />
  );

  return (
    <ScrollView style={globalStyle.globalContainer}>
      <CustomText label={WORD_DIR.serviceDetails} style={styles.heading} />
      <View style={styles.imagePickerContainer}>
        {serviceDetails.servicePreview.length > 0 && (
          <CustomCarousel data={serviceDetails.servicePreview} />
        )}
      </View>
      <View style={styles.actionContainer}>
        <CustomText
          label={
            errors.servicePreview
              ? errors.servicePreview
              : 'Click here for select image for service'
          }
          action={handleImagePicker}
          style={errors.servicePreview && {color: COLORS.error}}
        />
      </View>
      {renderInput(
        WORD_DIR.title,
        serviceDetails.title,
        WORD_DIR.title,
        'title',
        errors.title,
        30,
      )}
      {renderInput(
        WORD_DIR.description,
        serviceDetails.description,
        WORD_DIR.description,
        'description',
        errors.description,
        50,
      )}
      {renderInput(
        WORD_DIR.pricing,
        serviceDetails.pricing,
        WORD_DIR.pricing,
        'pricing',
        errors.pricing,
        3,
        'phone-pad'
      )}

      <CustomDropdown
        label="Select an Option"
        options={CATEGORY}
        value={serviceDetails.category}
        onValueChange={value =>
          setServiceDetails(prev => ({...prev, category: value}))
        }
        placeholder="Select an option"
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
  imagePickerContainer: {
    marginVertical: Spacing.medium,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: Spacing.small,
  },
});

export default CreateService;
