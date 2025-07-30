import React, {useState} from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {showSnackbar} from '../../redux/snackbarSlice';
import logo from '../../assets/logo.png';
import {EMAIL_REGEX} from '../../utils/regex';
import {verifyUsernameAndEmail} from '../../services/authService';
import CustomButton from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import {FontSize, Screen, Spacing} from '../../utils/dimension';
import {COLORS} from '../../utils/globalConstants/color';
import {WORD_DIR} from '../../utils/local/en';
import {PLACEHOLDER_DIR} from '../../utils/local/placeholder';
import {ErrorResponse, RootStackParamList, User} from 'interfaces';
import {ApiResponse} from 'services/apiClient';
import {globalStyle} from '../../utils/globalStyle';
import renderInput from '../../utils/renderInputUtil';
import {apiWithLoader} from '../../utils/apiWithLoader';
import {getErrorMessage} from '../../utils/errorHandler';

// Validation patterns
const PASSWORD_PATTERN = /^.{6,}$/;
const UPPERCASE_PATTERN = /[A-Z]/;
const DIGIT_PATTERN = /\d/;

interface RegistrationUser {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

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

  const [user, setUser] = useState<RegistrationUser>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState(initialErrorState);

  const handleValueChange = (field: string, value: string) => {
    setUser(prev => ({...prev, [field]: value}));
    validateField(field as keyof RegistrationUser, value);
  };

  const validateField = (field: keyof RegistrationUser, value: string) => {
    let error = '';
    switch (field) {
      case 'email':
        if (!value || !EMAIL_REGEX.test(value)) {
          error = WORD_DIR.invalidEmailFormat;
        }
        break;
      case 'password':
        if (!PASSWORD_PATTERN.test(value)) {
          error = 'Password must be at least 6 characters long';
        } else if (!UPPERCASE_PATTERN.test(value)) {
          error = WORD_DIR.passwordUppercaseRequired;
        } else if (!DIGIT_PATTERN.test(value)) {
          error = WORD_DIR.passwordDigitRequired;
        }
        break;
      case 'confirmPassword':
        if (value !== user.password) {
          error = WORD_DIR.passwordsDoNotMatch;
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
      const response: ApiResponse<User> | ErrorResponse = await apiWithLoader(
        () => verifyUsernameAndEmail(payload),
        WORD_DIR.register,
      );

      if (response?.data) {
        navigation.navigate('VerifyOTP', payload);
      } else {
        dispatch(
          showSnackbar({
            message: getErrorMessage(response, WORD_DIR.verificationFailed),
          }),
        );
      }
    } catch (error: any) {
      dispatch(
        showSnackbar({
          message: getErrorMessage(error, WORD_DIR.registrationFailed),
        }),
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={logo} style={styles.logo} />
        <View style={styles.card}>
          <View>
            <CustomText
              style={globalStyle.heading}
              label={WORD_DIR.registerHeading}
            />
            <CustomText
              style={globalStyle.subHeading}
              label={WORD_DIR.registerSubHeading}
            />
            {renderInput({
              value: user.firstName,
              placeholder: PLACEHOLDER_DIR.PLACEHOLDER_FIRSTNAME,
              field: 'firstName',
              errors,
              handleValueChange,
            })}
            {renderInput({
              value: user.lastName,
              placeholder: PLACEHOLDER_DIR.PLACEHOLDER_LASTNAME,
              field: 'lastName',
              errors,
              handleValueChange,
            })}
            {renderInput({
              value: user.username,
              placeholder: PLACEHOLDER_DIR.PLACEHOLDER_USERNAME,
              field: 'username',
              errors,
              handleValueChange,
            })}
            {renderInput({
              value: user.email,
              placeholder: PLACEHOLDER_DIR.PLACEHOLDER_EMAIL,
              field: 'email',
              keyboardType: 'email-address',
              errors,
              handleValueChange,
            })}
            {renderInput({
              value: user.phoneNumber,
              placeholder: PLACEHOLDER_DIR.PLACEHOLDER_PHONE_NUMBER,
              field: 'phoneNumber',
              keyboardType: 'phone-pad',
              errors,
              handleValueChange,
            })}
            {renderInput({
              value: user.password,
              placeholder: PLACEHOLDER_DIR.PLACEHOLDER_PASSWORD,
              field: 'password',
              secureTextEntry: true,
              errors,
              handleValueChange,
            })}
            {renderInput({
              value: user.confirmPassword,
              placeholder: PLACEHOLDER_DIR.PLACEHOLDER_CONFIRM_PASSWORD,
              field: 'confirmPassword',
              secureTextEntry: true,
              errors,
              handleValueChange,
            })}
            <CustomButton
              label={WORD_DIR.register}
              onPress={verifyEmail}
              disabled={!isFormValid}
              showLoader={true}
              loaderMessage={WORD_DIR.register}
              textStyle={{fontSize: FontSize.large}}
            />
          </View>
          <View style={styles.footer}>
            <CustomText label={WORD_DIR.haveAnAccount} />
            <CustomText
              label={WORD_DIR.login}
              style={globalStyle.actionLink}
              action={() => navigation.goBack()}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: Screen.width,
    height: Screen.height * 0.3,
    resizeMode: 'contain',
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: Spacing.large,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    flex: 1,
    justifyContent: 'space-between',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.medium,
  },
});

export default RegistrationScreen;
