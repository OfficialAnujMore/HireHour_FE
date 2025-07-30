import React, {useRef, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  Image,
  ScrollView,
} from 'react-native';
import CustomText from '../../components/CustomText';
import {WORD_DIR} from '../../utils/local/en';
import CustomButton from '../../components/CustomButton';
import {verifyOTP} from '../../services/authService';
import {registerUser} from '../../services/authService';
import {useDispatch} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'interfaces';
import {showSnackbar} from '../../redux/snackbarSlice';
import {Screen, Spacing} from '../../utils/dimension';
import {ErrorResponse, RegisterUser, User} from 'interfaces';
import {login} from '../../redux/authSlice';
import {ApiResponse} from 'services/apiClient';
import { globalStyle } from '../../utils/globalStyle';
import { COLORS } from '../../utils/globalConstants/color';
import {apiWithLoader} from '../../utils/apiWithLoader';
import {getErrorMessage} from '../../utils/errorHandler';
const OTP_LENGTH: number = 6;

const VerifyOTPScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'VerifyOTP'>>();
  const data = route.params;

  const [emailOTP, setEmailOTP] = useState<string[]>(
    Array(OTP_LENGTH).fill(''),
  );
  const [phoneOTP, setPhoneOTP] = useState<string[]>(
    Array(OTP_LENGTH).fill(''),
  );

  const emailInputRefs = useRef<(TextInput | null)[]>([]);
  const phoneInputRefs = useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (
    text: string,
    index: number,
    type: 'email' | 'phone',
  ): void => {
    if (!/^[0-9]?$/.test(text)) return;

    const otpArray = type === 'email' ? [...emailOTP] : [...phoneOTP];
    otpArray[index] = text;

    type === 'email' ? setEmailOTP(otpArray) : setPhoneOTP(otpArray);

    if (text && index < OTP_LENGTH - 1) {
      (type === 'email' ? emailInputRefs : phoneInputRefs).current[
        index + 1
      ]?.focus();
    }
  };

  function maskSensitiveData(input: string, type: 'email' | 'phone'): string {
    if (type === 'email') {
      // Email masking logic
      const atIndex = input.indexOf('@');
      const localPart = input.slice(0, atIndex); // Get the part before '@'
      const domain = input.slice(atIndex); // Get the domain part

      const maskedLocalPart =
        localPart.slice(0, -4).replace(/./g, '*') + localPart.slice(-4); // Mask all but the last 4 characters of the local part
      return maskedLocalPart + domain; // Combine the masked local part with the domain
    } else if (type === 'phone') {
      // Phone number masking logic (assuming phone number format like "1234567890")
      const visibleDigits = 4;
      const maskedPart = input.slice(0, -visibleDigits).replace(/\d/g, '*'); // Mask all but the last 4 digits
      const visiblePart = input.slice(-visibleDigits); // Keep the last 4 digits visible

      return maskedPart + visiblePart; // Combine the masked part with the visible digits
    }

    return input; // Return input if neither "email" nor "phone" type
  }

  const handleOtpBackspace = (index: number, type: 'email' | 'phone'): void => {
    const otpArray = type === 'email' ? emailOTP : phoneOTP;
    if (index > 0 && otpArray[index] === '') {
      (type === 'email' ? emailInputRefs : phoneInputRefs).current[
        index - 1
      ]?.focus();
    }
  };

  const handleSubmit = async (): Promise<any> => {
    Keyboard.dismiss();

    try {
      // Verify OTP before proceeding with registration
      const emailOTPResponse = await apiWithLoader(
        () => verifyOTP({
          key: data.email,
          otp: emailOTP.join(''),
        }),
        'Verifying OTP...'
      );

      if (!emailOTPResponse.success) {
        dispatch(
          showSnackbar({
            message: getErrorMessage(emailOTPResponse, 'OTP verification failed. Please try again.'),
          }),
        );
        return;
      }

      // Register the user if OTP verification is successful
      const registerUserResponse: ApiResponse<User> | ErrorResponse = await apiWithLoader(
        () => registerUser(data),
        'Creating account...'
      );

      if (registerUserResponse.success && registerUserResponse.data) {
        dispatch(
          showSnackbar({
            message: WORD_DIR.registerUser,
            success: true,
          }),
        );
        // Save token in AsyncStorage if available
        dispatch(login({user: registerUserResponse.data}));

        // Navigate to the home screen
        navigation.navigate('Home');
      } else {
        dispatch(
          showSnackbar({
            message: getErrorMessage(registerUserResponse, 'Account creation failed. Please try again.'),
          }),
        );
      }
    } catch (error: any) {
      dispatch(
        showSnackbar({
          message: getErrorMessage(error, 'An error occurred. Please try again.'),
        }),
      );
    }
  };

  const renderOtpInputs = (otpArray: string[], type: 'email' | 'phone') => (
    <View style={styles.otpContainer}>
      {otpArray.map((digit, index) => (
        <TextInput
          key={index}
          ref={el =>
            ((type === 'email' ? emailInputRefs : phoneInputRefs).current[
              index
            ] = el)
          }
          style={styles.input}
          value={digit}
          onChangeText={text => handleOtpChange(text, index, type)}
          onKeyPress={({nativeEvent}) => {
            if (nativeEvent.key === 'Backspace')
              handleOtpBackspace(index, type);
          }}
          maxLength={1}
          keyboardType="number-pad"
          returnKeyType="done"
          textAlign="center"
        />
      ))}
    </View>
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={globalStyle.globalContainer}>
      <Image
        source={require('../../assets/otp-security.png')}
        style={{width: Screen.width, height: Screen.height / 2.5}}
      />
      <CustomText
        label={`OTP has been sent to your email ending with ${maskSensitiveData(
          data.email,
          'email',
        )}`}
        numberOfLines={2}
        style={{alignSelf:'center'}}
      />
      {renderOtpInputs(emailOTP, 'email')}
      <CustomButton 
        label={WORD_DIR.verifyOTP} 
        onPress={handleSubmit}
        showLoader={true}
        loaderMessage="Verifying..."
      />
    </ScrollView>
  );
};

export default VerifyOTPScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: COLORS.white,
    paddingHorizontal: Spacing.medium,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: COLORS.lightGray,
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
