import React, {useState} from 'react';
import {View, Image, ScrollView, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {showSnackbar} from '../../redux/snackbarSlice';
import logo from '../../assets/logo.jpeg';
import {EMAIL_REGEX} from '../../utils/regex';
import {verifyUsernameAndEmail} from '../../services/authService';
import CustomInput from '../../components/CustomInput';
import {WORD_DIR} from '../../utils/local/en';
import {PLACEHOLDER_DIR} from '../../utils/local/placeholder';
import CustomButton from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import {FontSize, Screen, Spacing} from '../../utils/dimension';
import {COLORS} from '../../utils/globalConstants/color';
import {USER_DETAILS} from '../../utils/constants';
import {ErrorResponse, RootStackParamList, User} from 'interfaces';
import {ApiResponse} from 'services/apiClient';

// Validation patterns
const PASSWORD_PATTERN = /^.{6,}$/;
const UPPERCASE_PATTERN = /[A-Z]/;
const DIGIT_PATTERN = /\d/;

// Initial states
const initialUserState = {
  firstName: USER_DETAILS.firstName,
  lastName: USER_DETAILS.lastName,
  username: USER_DETAILS.username,
  email: USER_DETAILS.email,
  phoneNumber: USER_DETAILS.phoneNumber,
  password: USER_DETAILS.password,
  confirmPassword: USER_DETAILS.password,
};

const initialErrorState = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
};

const RegistrationScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [user, setUser] = useState(initialUserState);
  const [errors, setErrors] = useState(initialErrorState);

  const handleValueChange = (field: keyof typeof user, value: string) => {
    //

    setUser(prevState => ({...prevState, [field]: value}));
    validateField(field, value);
  };

  const validateField = (field: keyof typeof user, value: string) => {
    let error = '';

    switch (field) {
      case 'email':
        if (!value || !EMAIL_REGEX.test(value)) {
          error = 'Invalid email format';
        }
        break;
      case 'password':
        if (!PASSWORD_PATTERN.test(value)) {
          error = 'Password must be at least 6 characters long';
        } else if (!UPPERCASE_PATTERN.test(value)) {
          error = 'Password must contain at least one uppercase letter';
        } else if (!DIGIT_PATTERN.test(value)) {
          error = 'Password must contain at least one digit';
        }
        break;
      case 'confirmPassword':
        if (value !== user.password) {
          error = 'Passwords do not match';
        }
        break;
    }

    setErrors(prevErrors => ({...prevErrors, [field]: error}));
  };

  const isFormValid =
    Object.values(errors).every(error => error === '') &&
    user.email &&
    user.password &&
    user.confirmPassword;

  const verifyEmail = async () => {
    const {confirmPassword, ...payload} = user;

    try {
      // Attempt to verify username and email
      const response: ApiResponse<User> | ErrorResponse =
        await verifyUsernameAndEmail(payload);

      if (response?.data) {
        // Navigate to OTP verification screen if verification is successful
        navigation.navigate('VerifyOTP', payload);
      } else {
        // Handle case where no data is returned
        dispatch(
          showSnackbar({
            message: WORD_DIR.verificationFailed,
          }),
        );
      }
    } catch (error: any) {
      // Handle error case, show appropriate error message in snackbar
      dispatch(
        showSnackbar({
          message: error.message,
        }),
      );
    }
  };

  const renderInput = (
    label: string,
    value: string,
    placeholder: string,
    field: keyof typeof user,
    keyboardType?: 'default' | 'email-address' | 'phone-pad',
    secureTextEntry?: boolean,
  ) => (
    <CustomInput
      label={label}
      value={value}
      placeholder={placeholder}
      onValueChange={value => handleValueChange(field, value)}
      errorMessage={errors[field]}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
    />
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}>
      <View style={styles.imgContainer}>
        <Image style={styles.logo} source={logo} />
      </View>

      <View style={styles.formContainer}>
        {renderInput(
          WORD_DIR.firstName,
          user.firstName,
          PLACEHOLDER_DIR.PLACEHOLDER_FIRSTNAME,
          'firstName',
        )}
        {renderInput(
          WORD_DIR.lastName,
          user.lastName,
          PLACEHOLDER_DIR.PLACEHOLDER_LASTNAME,
          'lastName',
        )}

        {renderInput(
          WORD_DIR.username,
          user.username,
          PLACEHOLDER_DIR.PLACEHOLDER_USERNAME,
          'username',
        )}
        {renderInput(
          WORD_DIR.email,
          user.email,
          PLACEHOLDER_DIR.PLACEHOLDER_EMAIL,
          'email',
          'email-address',
        )}
        {renderInput(
          'Phone Number',
          user.phoneNumber,
          PLACEHOLDER_DIR.PLACEHOLDER_PHONE_NUMBER,
          'phoneNumber',
          'phone-pad',
        )}
        {renderInput(
          WORD_DIR.password,
          user.password,
          PLACEHOLDER_DIR.PLACEHOLDER_PASSWORD,
          'password',
          undefined,
          true,
        )}
        {renderInput(
          WORD_DIR.confirmPassword,
          user.confirmPassword,
          PLACEHOLDER_DIR.PLACEHOLDER_CONFIRM_PASSWORD,
          'confirmPassword',
          undefined,
          true,
        )}
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          label={WORD_DIR.register}
          onPress={verifyEmail}
          textStyle={{fontSize: FontSize.large}}
          disabled={!isFormValid}
        />
        <View style={styles.actionContainer}>
          <CustomText label={WORD_DIR.haveAnAccount} />
          <CustomText
            label={WORD_DIR.login}
            action={() => navigation.goBack()}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.medium,
    backgroundColor: COLORS.white,
    flexGrow: 1,
  },
  imgContainer: {
    alignItems: 'center',
  },
  logo: {
    resizeMode: 'contain',
    width: Screen.width,
    height: Screen.height * 0.3,
  },
  formContainer: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'column',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RegistrationScreen;
