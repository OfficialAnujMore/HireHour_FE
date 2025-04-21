import React, {useState, useCallback} from 'react';
import {
  View,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showSnackbar} from '../../redux/snackbarSlice';
import logo from '../../assets/logo.png';
import CustomButton from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import {FontSize, Screen, Spacing} from '../../utils/dimension';
import {WORD_DIR} from '../../utils/local/en';
import {COLORS} from '../../utils/globalConstants/color';
import {PLACEHOLDER_DIR} from '../../utils/local/placeholder';
import {loginUser} from '../../services/authService';
import {EMAIL_REGEX} from '../../utils/regex';
import {AuthUser, ErrorResponse, Errors, User} from 'interfaces';
import {login} from '../../redux/authSlice';
import {ApiResponse} from 'services/apiClient';
import {globalStyle} from '../../utils/globalStyle';
import renderInput from '../../utils/renderInputUtil';

const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [user, setUser] = useState<AuthUser>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Errors>({email: '', password: ''});

  const handleValueChange = (field: keyof AuthUser, value: string): void => {
    setUser(prev => ({...prev, [field]: value}));
    validateField(field, value);
  };

  const validateField = useCallback(
    (field: keyof AuthUser, value: string): void => {
      let error = '';
      if (field === 'email') {
        if (!value || !EMAIL_REGEX.test(value)) error = 'Invalid email format';
      } else if (field === 'password') {
        if (!value || value.length < 6) error = 'Minimum 6 characters required';
      }
      setErrors(prev => ({...prev, [field]: error}));
    },
    [],
  );

  const isFormValid = useCallback(() => {
    return !errors.email && !errors.password && user.email && user.password;
  }, [errors, user]);

  const handleLogin = async (): Promise<void> => {
    const response: ApiResponse<User> | ErrorResponse = await loginUser(user);
    if (response.success && response.data) {
      await AsyncStorage.setItem('token', response.data.token);
      dispatch(login({user: response.data}));
    } else {
      dispatch(showSnackbar({message: response.message}));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={logo} style={styles.logo} />
        <View style={globalStyle.card}>
          <View>
            <CustomText
              style={globalStyle.heading}
              label={WORD_DIR.loginHeading}
            />
            <CustomText
              style={globalStyle.subHeading}
              label={WORD_DIR.loginSubHeading}
            />

            {renderInput({
              label: WORD_DIR.email,
              value: user.email,
              placeholder: PLACEHOLDER_DIR.PLACEHOLDER_EMAIL,
              field: 'email',
              errors,
              handleValueChange,
            })}
            
            <View style={styles.passwordSection}>
              {renderInput({
                label: WORD_DIR.password,
                value: user.password,
                placeholder: PLACEHOLDER_DIR.PLACEHOLDER_PASSWORD,
                field: 'password',
                errors,
                secureTextEntry:true,
                handleValueChange,
              })}
            
              <View style={styles.forgotPassword}>
                <CustomText
                  label={WORD_DIR.forgotPassword}
                  style={globalStyle.actionLink}
                  action={() => {
                    navigation.goBack();
                  }}
                />
              </View>
            </View>

            <CustomButton
              label={WORD_DIR.login}
              onPress={handleLogin}
              disabled={!isFormValid()}
              textStyle={{fontSize: FontSize.large}}
            />
          </View>
          <View style={globalStyle.footer}>
            <CustomText label={WORD_DIR.dontHaveAnAccount} />
            <CustomText
              label={WORD_DIR.register}
              style={globalStyle.actionLink}
              action={() => navigation.navigate('RegistrationScreen')}
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
    shadowColor: '#000',
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
  passwordSection: {
    marginTop: Spacing.medium,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
});

export default LoginScreen;
