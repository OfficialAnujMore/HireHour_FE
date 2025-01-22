import React, { useState, useCallback } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../../redux/store';
import { showSnackbar } from '../../redux/snackbarSlice';
import logo from '../../assets/logo.jpeg';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import { FontSize, Screen, Spacing } from '../../utils/dimension';
import { WORD_DIR } from '../../utils/local/en';
import { COLORS } from '../../utils/globalConstants/color';
import { PLACEHOLDER_DIR } from '../../utils/local/placeholder';
import { loginUser } from '../../services/userService';
import { EMAIL_REGEX } from '../../utils/regex';

interface User {
    email: string;
    password: string;
}

interface Errors {
    email: string;
    password: string;
}

const LoginScreen: React.FC = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [user, setUser] = useState<User>({
        email: 'songArtist@gmail.com',
        password: 'Songartist@123',
    });
    const [errors, setErrors] = useState<Errors>({ email: '', password: '' });

    const handleValueChange = (field: keyof User, value: string): void => {
        setUser((prevState) => ({
            ...prevState,
            [field]: value,
        }));
        validateField(field, value);
    };

    const validateField = useCallback((field: keyof User, value: string): void => {
        let error = '';

        if (field === 'email') {
            if (!value || !EMAIL_REGEX.test(value)) {
                error = 'Invalid email format';
            }
        } else if (field === 'password') {
            if (!value || value.length < 6) {
                error = 'Password must be at least 6 characters';
            } else if (!/[A-Z]/.test(value)) {
                error = 'Password must contain at least one uppercase letter';
            } else if (!/\d/.test(value)) {
                error = 'Password must contain at least one digit';
            }
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: error,
        }));
    }, []);

    const isFormValid = useCallback(
        (): boolean => !errors.email && !errors.password && user.email !== '' && user.password !== '',
        [errors, user]
    );

    const handleLogin = async (): Promise<void> => {
        try {
            const response = await loginUser(user);
            if (response?.data) {
                await AsyncStorage.setItem('token', response.data.token);
                dispatch(login({ user: response.data }));
            }
        } catch (error: any) {
            dispatch(showSnackbar(error.message));
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.imgContainer}>
                <Image style={styles.logo} source={logo} />
            </View>
            <View style={styles.formContainer}>
                <CustomInput
                    label={WORD_DIR.email}
                    value={user.email}
                    placeholder={PLACEHOLDER_DIR.PLACEHOLDER_EMAIL}
                    keyboardType="email-address"
                    onValueChange={(value) => handleValueChange('email', value)}
                    errorMessage={errors.email}
                />
                <CustomInput
                    label={WORD_DIR.password}
                    value={user.password}
                    placeholder={PLACEHOLDER_DIR.PLACEHOLDER_PASSWORD}
                    secureTextEntry
                    onValueChange={(value) => handleValueChange('password', value)}
                    errorMessage={errors.password}
                />
                <View style={styles.buttonContainer}>
                    <CustomButton
                        label={WORD_DIR.login}
                        onPress={handleLogin}
                        textStyle={{ fontSize: FontSize.large }}
                        disabled={!isFormValid()}
                    />
                    <View style={styles.actionContainer}>
                        <CustomText label={WORD_DIR.dontHaveAnAccount} />
                        <CustomText
                            label={WORD_DIR.register}
                            action={() => navigation.navigate('Register')}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.medium,
        backgroundColor: COLORS.white,
    },
    logo: {
        resizeMode: 'contain',
        width: Screen.width,
        height: Screen.height * 0.3,
    },
    imgContainer: {
        alignItems: 'center',
    },
    formContainer: {
        marginTop: Spacing.large,
    },
    buttonContainer: {
        marginTop: Spacing.medium,
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing.small,
    },
});

export default LoginScreen;
