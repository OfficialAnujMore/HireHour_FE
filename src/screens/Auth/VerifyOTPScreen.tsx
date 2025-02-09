import React, {useRef, useState} from 'react';
import {View, TextInput, StyleSheet, Keyboard, Image, ScrollView} from 'react-native';
import CustomText from '../../components/CustomText';
import {WORD_DIR} from '../../utils/local/en';
import CustomButton from '../../components/CustomButton';
import {verifyOTP} from '../../services/authService';
import {registerUser} from '../../services/authService';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {showSnackbar} from '../../redux/snackbarSlice';
import {Screen, Spacing} from '../../utils/dimension';
import { RegisterUser } from 'interfaces';
import { login } from '../../redux/authSlice';
const OTP_LENGTH: number = 6;

const VerifyOTPScreen: React.FC<RegisterUser> = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const data = props.route.params;
  

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
    const emailOTPResponse = await verifyOTP({
      key: data.email,
      otp: emailOTP.join(''),
    });

    if (!emailOTPResponse.success) {
      dispatch(showSnackbar(emailOTPResponse.message));
      return;
    }

    // const phoneOTPResponse = await verifyOTP({
    //   key: data.phoneNumber,
    //   otp: phoneOTP.join(''),
    // });

    // if (!phoneOTPResponse.success) {
    //   dispatch(showSnackbar(phoneOTPResponse.message));
    //   return;
    // }

    const registerUserResponse = await registerUser(data);
    if (registerUserResponse) {
      dispatch(showSnackbar('Registered successfully'));
      dispatch(login({user: registerUserResponse.data}));
      // Navigate to the home screen
      navigation.navigate('Home');
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
      contentContainerStyle={styles.container}>
      <Image
        source={require('../../assets/otp-security.png')}
        style={{width: Screen.width, height: Screen.height / 2.5}}
      />
      <CustomText
        label={`OTP has been sent to your email ending with ${maskSensitiveData(
          data.email,
          'email',
        )}`}
      />
      {renderOtpInputs(emailOTP, 'email')}
      {/* <CustomText
        label={`OTP has been sent to your phone number ending with ${maskSensitiveData(
          data.phoneNumber,
          'phone',
        )}`}
      />
      {renderOtpInputs(phoneOTP, 'phone')} */}

      <CustomButton label={WORD_DIR.verifyOTP} onPress={handleSubmit} />
    </ScrollView>
  );
};

export default VerifyOTPScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
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
    borderColor: '#ccc',
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
