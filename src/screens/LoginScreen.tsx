import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../redux/store';
import logo from '../assets/logo.jpeg';
import { FontSize, Screen, Spacing } from '../utils/dimension';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { WORD_DIR } from '../utils/local/en';
import CustomText from '../components/CustomText';
import { COLOR } from '../utils/globalConstants/color';
import { loginUser } from '../services/userService';
import { showSnackbar } from '../redux/snackbarSlice';
import { EMAIL_REGEX } from '../utils/regex';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [user, setUser] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    interface ApiErrorResponse {
        data: any;
        message: string;
        statusCode: number;
        success: boolean;
    }

    const handleLogin = async () => {
        try {
            const response = await loginUser(user);
            if (response && response.data) {
                dispatch(login({ user: response.data }));
            }
        } catch (error: any) {
            dispatch(showSnackbar(error.message));

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
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: error,
        }));
    };

    // Check if the form is valid (no errors)
    const isFormValid = !errors.email && !errors.password && user.email && user.password;

    return (
        <View style={styles.container}>
            <View style={styles.imgContainer}>
                <Image style={styles.logo} source={logo} />
            </View>
            <View style={styles.formContainer}>
                <CustomInput
                    label={WORD_DIR.email}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    onValueChange={(value) => handleValueChange('email', value)}
                    errorMessage={errors.email}
                />
                <View style={styles.passwordContainer}>
                    <CustomInput
                        label={WORD_DIR.password}
                        placeholder="Enter password"
                        secureTextEntry
                        onValueChange={(value) => handleValueChange('password', value)}
                        errorMessage={errors.password}
                    />
                    <View style={styles.forgotPasswordContainer}>
                        <CustomText label={WORD_DIR.forgotPassword} action={() => {
                            console.log(`Forget password clicked`);
                        }} />
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <CustomButton
                        label={WORD_DIR.login}
                        onPress={handleLogin}
                        style={{ width: Screen.width * 0.8 }}
                        textStyle={{ fontSize: FontSize.large }}
                        disabled={!isFormValid}  // Disable button if form is invalid
                    />
                    <View style={styles.actionContainer}>
                        <CustomText label={WORD_DIR.dontHaveAnAccount} />
                        <CustomText label={WORD_DIR.register} action={() => {
                            navigation.navigate("Register")
                        }} />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        padding: Spacing.medium,
        backgroundColor: COLOR.white,
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

export default LoginScreen;
