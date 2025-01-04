// LoginScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../redux/store';
import logo from '../assets/logo.jpeg'
import { Screen, Spacing } from '../utils/dimension';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { WORD_DIR } from '../utils/local/en';
import CustomText from '../components/CustomText';

const LoginScreen = () => {
    const dispatch = useDispatch();

    const handleLogin = () => {
        const userData = {
            token: 'sample-auth-token',
            user: { id: '123', name: 'John Doe' },
        };
        dispatch(login(userData));
    };

    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={logo} />
            <CustomInput
                label={WORD_DIR.email}
                placeholder="Enter your email"
                keyboardType="email-address"
                validationRules={[
                    { rule: (value) => value.includes('@'), message: 'Must include @ symbol' },
                    { rule: (value) => value.length > 5, message: 'Must be longer than 5 characters' },
                ]}
                onValueChange={(value) => console.log('Email:', value)}
            />
            <CustomInput
                label={WORD_DIR.password}
                placeholder="Enter password"
                keyboardType="email-address"
                validationRules={[
                    { rule: (value) => value.includes('@'), message: 'Must include @ symbol' },
                    { rule: (value) => value.length > 5, message: 'Must be longer than 5 characters' },
                ]}
                onValueChange={(value) => console.log('Email:', value)}
            />

            <View style={styles.registerContainer}>

            <CustomText label={WORD_DIR.dontHaveAnAccount} />
            <CustomText label={WORD_DIR.register} />
            </View>
            <CustomButton
                label={WORD_DIR.login}
                onPress={handleLogin}
                style={{ width: 200 }}
                textStyle={{ fontSize: 18 }}
            />

        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
        // alignItems: 'center',
        padding: Spacing.medium,
        // backgroundColor: 'red'
    },
    logo: {
        width: Screen.width * 0.6,
        height: Screen.height * 0.2,
    },
    registerContainer:{
        // display:'flex',
        flexDirection:'row'
    }
});

export default LoginScreen;
