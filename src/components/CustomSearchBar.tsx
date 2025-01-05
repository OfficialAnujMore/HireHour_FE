import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { COLOR } from '../utils/globalConstants/color';
import { FontSize, Screen, Spacing } from '../utils/dimension';

interface CustomSearchBarProps {
    onSearch: (query: string) => void; // Function to handle search logic
}

const CustomSearchBar: React.FC<CustomSearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState<string>('');

    const handleSearch = () => {
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <TextInput
                    style={styles.input}
                    placeholder="Search..."
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity onPress={handleSearch}>
                    <Feather name="home" size={20} color="#000" />
                </TouchableOpacity>
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
        backgroundColor: COLOR.white,
        borderRadius: Spacing.small,
        width: Screen.width,
        paddingHorizontal: Spacing.medium,
        paddingVertical:Spacing.small
    },
    input: {
        flex: 1,
        fontSize: FontSize.medium,
    },
});

export default CustomSearchBar;
