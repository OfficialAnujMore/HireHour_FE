import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import CustomSearchBar from '../../components/CustomSearchBar';
import CustomCards from '../../components/CustomCards';
import CustomText from '../../components/CustomText';
import { FontSize, Spacing } from '../../utils/dimension';
import { getGreeting } from '../../utils/globalFunctions';
import { getServiceProviders } from '../../services/userService';
import { User } from '../../interfaces/userInterface';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  console.log(user);
  
  const [data, setData] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);

  // Function to fetch service providers
  const fetchServiceProviders = useCallback(async () => {
    try {
      const categories = ["Photography", "Guitar", "Art", "Music"];
      const response = await getServiceProviders(categories);
      console.log('avatarUri=========.>',response.data);
      
      setData(response.data);
      setFilteredData(response.data); // Set filtered data as the default
    } catch (error) {
      console.error("Error fetching service providers:", error);
    }
  }, []);

  // Use `useFocusEffect` to call the API whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchServiceProviders();
    }, [fetchServiceProviders])
  );

  // Search handler
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
      <CustomText label={`${getGreeting()}, ${user?.firstName}`} style={styles.greetingText} />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CustomCards item={item} handlePress={()=>{
          navigation.navigate("ServiceDetails", item)
        }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: Spacing.small,
  },
  greetingText: {
    fontSize: FontSize.large,
    fontWeight: '600',
  },
});

export default HomeScreen;
