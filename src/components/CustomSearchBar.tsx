import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../utils/globalConstants/color';
import { FontSize, Screen, Spacing } from '../utils/dimension';
import CustomInput from './CustomInput';

interface CustomSearchBarProps {
    onSearch: (query: string) => void; // Function to handle search logic
}

const CustomSearchBar: React.FC<CustomSearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState<string>('');

    const handleSearch = (text: string) => {
        setQuery(text);
        if (text.trim()) {
            onSearch(text);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <CustomInput
                    style={styles.input}
                    placeholder="Search..."
                    value={query}
                    onChangeText={handleSearch}
                />
                <Icon name="search-outline" size={25} color="#000" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: Spacing.small,
        width: Screen.width,
        height: Screen.height / 15,
        paddingHorizontal: Spacing.medium,
        paddingVertical: Spacing.small,
    },
    input: {
        flex: 1,
        fontSize: FontSize.medium,
    },
});

export default CustomSearchBar;
