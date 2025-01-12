import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../redux/store';
import logo from '../assets/logo.jpeg';
import { FontSize, Screen, Spacing } from '../utils/dimension';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { WORD_DIR } from '../utils/local/en';
import CustomText from '../components/CustomText';
import { COLORS } from '../utils/globalConstants/color';
import { loginUser, registerUser } from '../services/userService';
import { showSnackbar } from '../redux/snackbarSlice';
import { EMAIL_REGEX } from '../utils/regex';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    // State to store form data
    const [user, setUser] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        phoneNumber: '1121212121212',
        confirmPassword: '',
    });

    // State to store error messages
    const [errors, setErrors] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleRegister = async () => {
        // Prepare the payload without modifying the original `user` object
        const { confirmPassword, ...payload } = user; // Omit `confirmPassword` from the payload

        try {
            const response = await registerUser(payload);

            if (response && response.data) {
                // Dispatch the user data to the Redux store
                dispatch(login({ user: response.data }));
                // Navigate to the desired screen or show success
                navigation.navigate('Home');
            }
        } catch (error: any) {
            // Handle error by showing a snackbar message
            dispatch(showSnackbar(error.message || 'Registration failed. Please try again.'));
        }
    };
    const handleValueChange = (field: keyof typeof user, value: string) => {
        setUser((prevState) => ({
            ...prevState,
            [field]: value,
        }));

        // Validate the input field and set errors
        validateField(field, value);
    };

    const validateField = (field: keyof typeof user, value: string) => {
        let error = '';

        if (field === 'email') {
            const emailPattern = EMAIL_REGEX;
            if (!value || !emailPattern.test(value)) {
                error = 'Invalid email format';
            }
        } else if (field === 'password') {
            const passwordPattern = /^.{6,}$/;
            const upperCasePattern = /[A-Z]/;
            const numberPattern = /\d/;

            if (!value || !passwordPattern.test(value)) {
                error = 'Password must be at least 6 characters long';
            } else if (!upperCasePattern.test(value)) {
                error = 'Password must contain at least one uppercase letter';
            } else if (!numberPattern.test(value)) {
                error = 'Password must contain at least one digit';
            }
        } else if (field === 'confirmPassword') {
            if (value !== user.password) {
                error = 'Passwords do not match';
            }
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: error,
        }));
    };

    // Check if the form is valid (no errors)
    const isFormValid = Object.values(errors).every((error) => error === '') &&
        user.email &&
        user.password &&
        user.confirmPassword;

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false} >
            <View style={styles.imgContainer}>
                <Image style={styles.logo} source={logo} />
            </View>
            <View style={styles.formContainer}>
                <CustomInput
                    label={WORD_DIR.name}
                    placeholder="Enter your name"
                    onValueChange={(value) => handleValueChange('name', value)}
                    errorMessage={errors.name}
                />

                <CustomInput
                    label={WORD_DIR.username}
                    placeholder="Enter your username"
                    onValueChange={(value) => handleValueChange('username', value)}
                    errorMessage={errors.username}
                />

                <CustomInput
                    label={WORD_DIR.email}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    onValueChange={(value) => handleValueChange('email', value)}
                    errorMessage={errors.email}
                />
                <CustomInput
                    label="Phone Number"
                    onValueChange={(value) => handleValueChange('phoneNumber', value)}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                />
                <CustomInput
                    label={WORD_DIR.password}
                    placeholder="Enter password"
                    secureTextEntry
                    onValueChange={(value) => handleValueChange('password', value)}
                    errorMessage={errors.password}
                />
                <CustomInput
                    label={WORD_DIR.confirmPassword}
                    placeholder="Please confirm password"
                    secureTextEntry
                    onValueChange={(value) => handleValueChange('confirmPassword', value)}
                    errorMessage={errors.confirmPassword}
                />
            </View>

            <View style={styles.buttonContainer}>
                <CustomButton
                    label={WORD_DIR.register}
                    onPress={handleRegister}
                    textStyle={{ fontSize: FontSize.large }}
                    disabled={!isFormValid}  // Disable button if form is invalid
                />
                <View style={styles.actionContainer}>
                    <CustomText label={WORD_DIR.haveAnAccount} />
                    <CustomText label={WORD_DIR.login} action={() => {
                        navigation.goBack()
                    }} />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        padding: Spacing.medium,
        backgroundColor: COLORS.white,
        flexGrow: 1,
    },
    logo: {
        resizeMode: 'contain',
        width: Screen.width,
        height: Screen.height * 0.3,
    },
    buttonContainer: {
        flexDirection: 'column',
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imgContainer: {
        alignItems: 'center',
    },
    formContainer: {
        display: 'flex',
    },
    passwordContainer: {},
    forgotPasswordContainer: {
        justifyContent: 'flex-end',
    },
});

export default RegisterScreen;
