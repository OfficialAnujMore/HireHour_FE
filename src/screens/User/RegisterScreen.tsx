import React, { useState } from 'react';
import { View, Image, ScrollView, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { login } from '../../redux/store';
import { showSnackbar } from '../../redux/snackbarSlice';
import { registerUser } from '../../services/userService';
import logo from '../../assets/logo.jpeg';
import { FontSize, Screen, Spacing } from '../../utils/dimension';
import { WORD_DIR } from '../../utils/local/en';
import { PLACEHOLDER_DIR } from '../../utils/local/placeholder';
import { COLORS } from '../../utils/globalConstants/color';
import { EMAIL_REGEX } from '../../utils/regex';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import CustomText from '../../components/CustomText';

// Validation patterns
const PASSWORD_PATTERN = /^.{6,}$/;
const UPPERCASE_PATTERN = /[A-Z]/;
const DIGIT_PATTERN = /\d/;

// Initial states
const initialUserState = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
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

const RegisterScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [user, setUser] = useState(initialUserState);
    const [errors, setErrors] = useState(initialErrorState);

    const handleValueChange = (field: keyof typeof user, value: string) => {
        // console.log(field,value);
        
        setUser((prevState) => ({ ...prevState, [field]: value }));
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

        setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    };

    const isFormValid =
        Object.values(errors).every((error) => error === '') &&
        user.email &&
        user.password &&
        user.confirmPassword;

    const handleRegister = async () => {
        console.log('Registering user...');
        const { confirmPassword, ...payload } = user;
        console.log('Payload without confirmPassword:', payload);

        try {
            const response = await registerUser(payload);

            if (response?.data) {
                // Dispatch the login action with the registered user data
                dispatch(login({ user: response.data }));

                // Navigate to the home screen
                navigation.navigate('Home');
            }
        } catch (error: any) {
            console.log({error});

            // Extract and dispatch the error message to the Snackbar
            const errorMessage = error??'Registration failed. Please try again.';
            dispatch(showSnackbar(errorMessage));
        }
    };


    const renderInput = (
        label: string,
        value: string,
        placeholder: string,
        field: keyof typeof user,
        keyboardType?: 'default' | 'email-address' | 'phone-pad',
        secureTextEntry?: boolean
    ) => (
        <CustomInput
            label={label}
            value={value}
            placeholder={placeholder}
            onValueChange={(value) => handleValueChange(field, value)}
            errorMessage={errors[field]}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
        />
    );

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        >
            <View style={styles.imgContainer}>
                <Image style={styles.logo} source={logo} />
            </View>

            <View style={styles.formContainer}>
                {renderInput(WORD_DIR.firstName, user.firstName, PLACEHOLDER_DIR.PLACEHOLDER_FIRSTNAME, 'firstName')}
                {renderInput(WORD_DIR.lastName, user.lastName, PLACEHOLDER_DIR.PLACEHOLDER_LASTNAME, 'lastName')}

                {renderInput(WORD_DIR.username, user.username, PLACEHOLDER_DIR.PLACEHOLDER_USERNAME, 'username')}
                {renderInput(WORD_DIR.email, user.email, PLACEHOLDER_DIR.PLACEHOLDER_EMAIL, 'email', 'email-address')}
                {renderInput(
                    'Phone Number',
                    user.phoneNumber,
                    PLACEHOLDER_DIR.PLACEHOLDER_PHONE_NUMBER,
                    'phoneNumber',
                    'phone-pad'
                )}
                {renderInput(
                    WORD_DIR.password,
                    user.password,
                    PLACEHOLDER_DIR.PLACEHOLDER_PASSWORD,
                    'password',
                    undefined,
                    true
                )}
                {renderInput(
                    WORD_DIR.confirmPassword,
                    user.confirmPassword,
                    PLACEHOLDER_DIR.PLACEHOLDER_CONFIRM_PASSWORD,
                    'confirmPassword',
                    undefined,
                    true
                )}
            </View>

            <View style={styles.buttonContainer}>
                <CustomButton
                    label={WORD_DIR.register}
                    onPress={handleRegister}
                    textStyle={{ fontSize: FontSize.large }}
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

export default RegisterScreen;
