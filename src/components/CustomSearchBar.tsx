import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../utils/globalConstants/color';
import {FontSize, Screen, Spacing} from '../utils/dimension';
import CustomInput from './CustomInput';

interface CustomSearchBarProps {
  onSearch: (query: string) => void;
}

const CustomSearchBar: React.FC<CustomSearchBarProps> = ({onSearch}) => {
  const [query, setQuery] = useState<string>('');

  const handleChange = (text: string) => {
    setQuery(text);
    onSearch(text);
  };

  return (
    <View style={styles.container}>
      {/* <Icon name="search-outline" size={25} color="#000" /> */}
      <CustomInput
        placeholder="Search..."
        value={query}
        onValueChange={handleChange}
        style={styles.input} // Make sure CustomInput styles are adjusted
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: COLORS.white,
    borderRadius: Spacing.small,
    paddingHorizontal: Spacing.small,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  input: {
    flex: 1,
    fontSize: FontSize.medium,
  },
});

export default CustomSearchBar;
