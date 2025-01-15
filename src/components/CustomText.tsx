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
            <TouchableOpacity onPress={action}>
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
    },
    textStyle: {
        fontSize: FontSize.medium,
    },
    clickableText: {
        textDecorationLine: 'underline',
        color: COLORS.grey,
    },
});

export default CustomText;
