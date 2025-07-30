import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  View,
  StatusBar,
} from 'react-native';
import {FontSize, Screen, Spacing} from '../../utils/dimension';
import CustomText from '../../components/CustomText';
import {WORD_DIR} from '../../utils/local/en';
import {COLORS} from '../../utils/globalConstants/color';
import CustomButton from '../../components/CustomButton';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import CustomDropdown from '../../components/CustomDropdown';
import {CATEGORY, MAX_FIELD_CHAR_COUNT} from '../../utils/constants';
import {useNavigation, useRoute, useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from 'interfaces';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import CustomCarousel from '../../components/CustomCarousel';
import {showSnackbar} from '../../redux/snackbarSlice';
import {updateServiceDetails, clearServiceCreation} from '../../redux/serviceCreationSlice';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {globalStyle} from '../../utils/globalStyle';
import renderInput from '../../utils/renderInputUtil';
import InteractiveButton from '../../components/ExpandableUploadButton';
import ExpandableUploadButton from '../../components/ExpandableUploadButton';
import {getErrorMessage} from '../../utils/errorHandler';

const CreateService: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Create Service'>>();
  const initialServiceDetails = (route.params as any) || {};

  const dispatch = useDispatch();
  const serviceCreationState = useSelector((state: RootState) => state.serviceCreation);

  // Initialize with Redux state or route params
  const [serviceDetails, setServiceDetails] = useState({
    title: serviceCreationState.title || initialServiceDetails.title || '',
    description: serviceCreationState.description || initialServiceDetails.description || '',
    pricing: serviceCreationState.pricing || initialServiceDetails.pricing || '',
    category: serviceCreationState.category || initialServiceDetails.category || CATEGORY[Object.keys(CATEGORY)[0] as keyof typeof CATEGORY],
    servicePreview: serviceCreationState.servicePreview.length > 0 ? serviceCreationState.servicePreview : (initialServiceDetails.servicePreview || []),
  });

  // Sync local state with Redux state when component mounts
  useEffect(() => {
    if (serviceCreationState.title || serviceCreationState.description || serviceCreationState.pricing || serviceCreationState.servicePreview.length > 0) {
      setServiceDetails({
        title: serviceCreationState.title,
        description: serviceCreationState.description,
        pricing: serviceCreationState.pricing,
        category: serviceCreationState.category,
        servicePreview: serviceCreationState.servicePreview,
      });
    }
  }, []);


  const [errors, setErrors] = useState({
    title: '',
    description: '',
    pricing: '',
    servicePreview: '',
    email: '',
    password: '',
  });

  const validateFields = () => {
    const newErrors = {
      title: '',
      description: '',
      pricing: '',
      servicePreview: '',
      email: '',
      password: '',
    };
    let valid = true;

    if (!serviceDetails.title) {
      newErrors.title = WORD_DIR.titleRequired;
      valid = false;
    }
    if (!serviceDetails.description) {
      newErrors.description = WORD_DIR.descriptionRequired;
      valid = false;
    }
    if (!serviceDetails.pricing) {
      newErrors.pricing = WORD_DIR.pricingRequired;
      valid = false;
    }
    if (serviceDetails.servicePreview.length === 0) {
      dispatch(
        showSnackbar({
          message: getErrorMessage(null, WORD_DIR.pleaseSelectImage),
        }),
      );
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleValueChange = (field: string, value: string): void => {
    setServiceDetails((prev: typeof serviceDetails) => ({
      ...prev,
      [field]: value,
    }));
    
    // Update Redux state
    dispatch(updateServiceDetails({
      [field]: value,
    }));
  };

  const handleImagePicker = async () => {
    const options = {
      mediaType: 'photo' as const,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      selectionLimit: 10, // Allow up to 10 images
      multiple: true, // Enable multiple selection
    };

    try {
      const response = await launchImageLibrary(options);
      if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const updatedServicePreview = [...serviceDetails.servicePreview, ...(response.assets || [])];
        setServiceDetails((prev: typeof serviceDetails) => ({
          ...prev,
          servicePreview: updatedServicePreview,
        }));
        
        // Update Redux state
        dispatch(updateServiceDetails({
          servicePreview: updatedServicePreview,
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const removeImage = (index: number) => {
    const updatedServicePreview = serviceDetails.servicePreview.filter((_: any, i: number) => i !== index);
    setServiceDetails((prev: typeof serviceDetails) => ({
      ...prev,
      servicePreview: updatedServicePreview,
    }));
    
    // Update Redux state
    dispatch(updateServiceDetails({
      servicePreview: updatedServicePreview,
    }));
  };

  const clearAllImages = () => {
    setServiceDetails((prev: typeof serviceDetails) => ({
      ...prev,
      servicePreview: [],
    }));
    
    // Update Redux state
    dispatch(updateServiceDetails({
      servicePreview: [],
    }));
  };

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <CustomText label={WORD_DIR.serviceDetails} style={styles.heading} />
          <CustomText
            label="Create an amazing service to showcase your talent"
            style={styles.subHeading}
            numberOfLines={4}
          />
        </View>

        {/* Image Upload Section */}
        <View style={styles.imageSection}>
          <View style={styles.sectionHeader}>
            <CustomText label="Service Images" style={styles.sectionTitle} />
            <CustomText
              label="Add photos to showcase your work"
              style={styles.sectionSubtitle}
            />
          </View>

          {serviceDetails.servicePreview.length > 0 && (
            <View style={styles.carouselContainer}>
              <CustomCarousel data={serviceDetails.servicePreview} />
              <View style={styles.imageCountContainer}>
                <CustomText
                  label={`${serviceDetails.servicePreview.length} image(s) selected`}
                  style={styles.imageCount}
                />
              </View>
            </View>
          )}

          <View style={styles.uploadSection}>
            {serviceDetails.servicePreview.length > 0 && (
              <CustomButton
                onPress={clearAllImages}
                label="Clear Images"
                style={styles.clearButton}
                textStyle={styles.clearButtonText}
              />
            )}
            <ExpandableUploadButton
              icon="cloud-upload-outline"
              label={
                serviceDetails.servicePreview.length > 0
                  ? 'Add More Photos'
                  : WORD_DIR.uploadPhotos
              }
              onTrigger={handleImagePicker}
            />
          </View>
        </View>

        {/* Service Details Section */}
        <View style={styles.detailsSection}>
          <View style={styles.sectionHeader}>
            <CustomText
              label="Service Information"
              style={styles.sectionTitle}
            />
            <CustomText
              label="Tell clients about your service"
              style={styles.sectionSubtitle}
            />
          </View>

          <View style={styles.formContainer}>
            {renderInput({
              label: WORD_DIR.serviceTitleText,
              value: serviceDetails.title,
              placeholder: WORD_DIR.serviceTitleText,
              field: 'title',
              maxLength: MAX_FIELD_CHAR_COUNT.serviceTitle,
              errors,
              handleValueChange,
            })}

            {renderInput({
              label: WORD_DIR.serviceDescription,
              value: serviceDetails.description,
              placeholder: WORD_DIR.serviceDescription,
              field: 'description',
              maxLength: MAX_FIELD_CHAR_COUNT.serviceDescription,
              errors,
              handleValueChange,
            })}

            {/* <View style={styles.pricingRow}> */}
            {renderInput({
                label: WORD_DIR.pricing,
                value: serviceDetails.pricing,
                placeholder: WORD_DIR.pricingPlaceholder,
                field: 'pricing',
                maxLength: 5,
                errors,
                handleValueChange,
                keyboardType: 'phone-pad',
                prefix: '$ ',
              })}

              <View style={styles.categoryContainer}>
                <CustomDropdown
                  label={WORD_DIR.selectCategory}
                  options={CATEGORY}
                  value={serviceDetails.category}
                  onValueChange={value => {
                    setServiceDetails((prev: typeof serviceDetails) => ({
                      ...prev,
                      category: value as any,
                    }));
                    
                    // Update Redux state
                    dispatch(updateServiceDetails({
                      category: value as any,
                    }));
                  }}
                />
              </View>
            {/* </View> */}
          </View>
        </View>

        {/* Action Section */}
        <View style={styles.actionSection}>
          <CustomButton
            onPress={() => {
              if (validateFields()) {
                console.log('Create Service serviceDetails', serviceDetails);
                navigation.navigate('Create Schedule' as any, serviceDetails);
              }
            }}
            label={WORD_DIR.next}
            showLoader={true}
            loaderMessage="Processing..."
            style={styles.nextButton}
          />
        </View>
      </ScrollView>
    </>
  );
};

// styles remain the same

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: Spacing.medium,
  },
  headerSection: {
    paddingTop: Spacing.large,
    paddingBottom: Spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  heading: {
    fontSize: FontSize.extraLarge,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: Spacing.small,
  },
  subHeading: {
    fontSize: FontSize.medium,
    color: COLORS.gray,
    lineHeight: 22,
  },
  imageSection: {
    paddingVertical: Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  sectionHeader: {
    marginBottom: Spacing.small,
  },
  sectionTitle: {
    fontSize: FontSize.large,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: Spacing.small,
  },
  sectionSubtitle: {
    fontSize: FontSize.small,
    color: COLORS.gray,
  },
  carouselContainer: {
    marginBottom: Spacing.medium,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageCountContainer: {
    padding: Spacing.small,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  imageCount: {
    fontSize: FontSize.small,
    color: COLORS.gray,
    textAlign: 'center',
  },
  uploadSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsSection: {
    paddingVertical: Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  formContainer: {},
  pricingRow: {
    flexDirection: 'row',
    gap: Spacing.large,
  },
  categoryContainer: {
    flex: 1,
  },
  actionSection: {
    paddingVertical: Spacing.medium,
    paddingBottom: Spacing.large,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: Spacing.medium,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  clearButton: {
    backgroundColor: COLORS.error,
    borderRadius: 8,
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.medium,
  },
  clearButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: Spacing.small,
  },
});

export default CreateService;
