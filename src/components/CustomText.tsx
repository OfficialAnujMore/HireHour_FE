import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextStyle, StyleProp } from 'react-native';
import { FontSize, Spacing } from '../utils/dimension';
import { COLORS } from '../utils/globalConstants/color';

type CustomTextProps = {
    label: React.ReactNode;
    style?: StyleProp<TextStyle>;
    action?: () => void; // Optional action handler
};

const CustomText: React.FC<CustomTextProps> = ({ label, style, action }) => (
    <View style={styles.container}>
        {action ? (
            <TouchableOpacity onPress={action} style={styles.touchable}>
                <Text style={[styles.textStyle, styles.clickableText, style]}>{label}</Text>
            </TouchableOpacity>
        ) : (
            <Text style={[styles.textStyle, style]}>{label}</Text>
        )}
    </View>
);

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.small / 2,
        // Ensure no extra space is added around the text
        alignItems: 'flex-start',  // Align the text at the start of the container
    },
    touchable: {
        // Ensure TouchableOpacity doesn't add extra padding
        alignItems: 'center',  // Keeps the clickable text centered
    },
    textStyle: {
        fontSize: FontSize.medium,
        // Avoid width or height constraints, let text take its own size
        padding: 0,
        margin: 0,
    },
    clickableText: {
        textDecorationLine: 'underline',
        color: COLORS.grey,
    },
});

export default CustomText;
