import React, { useState, useRef } from 'react';
import {
    Text,
    View,
    StyleSheet,
    ViewStyle,
} from 'react-native';
import { Screen } from '../utils/dimension';



type CustomTextProps = {
    label?: string;
    style?: ViewStyle
};

const CustomText: React.FC<CustomTextProps> = ({
    label,
    style
}) => {
    return (
        <View style={styles.container}>
            <Text style={[styles.textStyle, style]}>{label}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
    },
    textStyle: {
        fontSize: 14,
        backgroundColor: '#fff',
        paddingHorizontal: 4,
    },
});

export default CustomText;
