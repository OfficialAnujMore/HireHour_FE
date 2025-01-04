// LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../redux/store';
import logo from '../assets/logo.jpeg'
import { FontSize, Screen, Spacing } from '../utils/dimension';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { WORD_DIR } from '../utils/local/en';
import CustomText from '../components/CustomText';
import { COLOR } from '../utils/globalConstants/color';
import { loginUser } from '../services/userService';

const LoginScreen = () => {
    const dispatch = useDispatch();
    const [user, setUser] = useState({
        email: 'anujmore@gmail.com',
        password: 'Anuj@123'
    });

    const handleLogin = async () => {
        const response = await loginUser(user)
        console.log('Handle login, response', response);
        
        if (response) {
            // dispatch(login(response.data));

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
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    validationRules={[
                        { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
                    ]}
                    onValueChange={(value) => console.log('Email:', value)}
                />
                <View style={styles.passwordContainer}>
                    <CustomInput
                        label={WORD_DIR.password}
                        placeholder="Enter password"
                        keyboardType="email-address"
                        validationRules={[
                            { pattern: /^.{6,}$/, message: 'Password must be at least 6 characters long' },
                            { pattern: /[A-Z]/, message: 'Password must contain at least one uppercase letter' },
                            { pattern: /\d/, message: 'Password must contain at least one digit' },
                        ]}
                        onValueChange={(value) => console.log('Email:', value)}
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
                    />
                    <View style={styles.actionContainer}>
                        <CustomText label={WORD_DIR.dontHaveAnAccount} />
                        <CustomText label={WORD_DIR.register} action={() => {
                            console.log(`Register clicked`);

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
        width: Screen.width,
        height: Screen.height * 0.4,
    },
    buttonContainer: {
        flexDirection: 'column'
    },
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgContainer: {
        alignItems: 'center',
    },
    formContainer: {
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
    },
    passwordContainer: {
    },
    forgotPasswordContainer: {
        justifyContent: 'flex-end'
    },
});

export default LoginScreen;
