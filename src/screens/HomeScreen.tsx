import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import CustomSearchBar from '../components/CustomSearchBar';
import CustomCards from '../components/CustomCards';
import CustomText from '../components/CustomText';
import { FontSize, Spacing } from '../utils/dimension';
import { getGreeting } from '../utils/globalFunctions';
import { getServiceProviders } from '../services/userService';
import { User } from '../interfaces/userInterface';
import { COLORS } from '../utils/globalConstants/color';

const HomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [data, setData] = useState<User[] | []>([]);
  const [filteredData, setFilteredData] = useState<User[] | []>([]);

  const fetchServiceProviders = async () => {
    const categories = ["Photography", "Guitar", "Art", "Music"];
    const response = await getServiceProviders(categories);
    setData(response.data);
    setFilteredData(response.data); 
  };

  useEffect(() => {
    console.log('Home screen');
    fetchServiceProviders();
  }, []);

  const handleSearch = (query: string) => {
    if (query) {
      const filtered = data.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data); // Reset filtered data to the full data if no query
    }
  };

  return (
    <View style={styles.container}>
      <CustomSearchBar onSearch={handleSearch} />
      <CustomText label={`${getGreeting()}, ${user?.name}`} style={styles.greetingText} />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CustomCards item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: Spacing.small,
    // backgroundColor: COLORS.white,
  },
  greetingText: {
    fontSize: FontSize.large,
    fontWeight: '600',
  },
});

export default HomeScreen;
