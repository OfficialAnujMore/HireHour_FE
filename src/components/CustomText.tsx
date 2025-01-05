import React, { useState, useRef, ReactEventHandler } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    TextStyle,
    StyleProp,
} from 'react-native';
import { FontSize, Screen, Spacing } from '../utils/dimension';
import { COLOR } from '../utils/globalConstants/color';



type CustomTextProps = {
    label?: string|number;
    style?:  StyleProp<TextStyle>;
    action?: () => void; // Make this optional
};

const CustomText: React.FC<CustomTextProps> = ({ label, style, action }) => {
    const isClickable = Boolean(action);

    return (
        <View style={styles.container}>
            {isClickable ? (
                <TouchableOpacity onPress={action}>
                    <Text style={[styles.textStyle, styles.clickableText, style]}>{label}</Text>
                </TouchableOpacity>
            ) : (
                <Text style={[styles.textStyle, style]}>{label}</Text>
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start',
        marginBottom: Spacing.small/2
    },
    textStyle: {
        fontSize: FontSize.medium,
    },
    clickableText: {
        textDecorationLine: 'underline', // Adds underline to the text
        color: COLOR.grey, // Optional: Changes the color for clickable text
      },
});

export default CustomText;
