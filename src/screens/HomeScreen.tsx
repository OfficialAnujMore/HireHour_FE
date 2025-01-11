import React, { useState } from 'react';
import { View, Text, Button, Alert, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout, RootState } from '../redux/store';
import CustomSearchBar from '../components/CustomSearchBar';
import CustomCards from '../components/CustomCards';
import CustomText from '../components/CustomText';
import { FontSize, Spacing } from '../utils/dimension';
import { getGreeting } from '../utils/globalFunctions';

const HomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const mockData = [
    {
      id: '1',
      title: 'Go Clean',
      description: 'Bathroom, Garden, Kitchen',
      location: 'Chandigarh City',
      status: 'Preorder',
      offer: '50% OFF UPTO $20',
      rating: 4.5,
      time: '30 mins',
      distance: '3 Km',
      image: 'https://via.placeholder.com/150',
      previewImages: [/* Add preview images here */]
    },
    {
      id: '2',
      title: 'Sam Clean services',
      description: 'Bedroom, Kitchen, Garden',
      location: 'Chandigarh City',
      status: 'Schedule Order',
      offer: null,
      rating: 4.2,
      time: '30 mins',
      distance: '3 Km',
      image: 'https://via.placeholder.com/150',
      previewImages: [/* Add preview images here */]
    },
    // Add more items as needed
  ];
  // State to hold filtered data
  const [filteredData, setFilteredData] = useState(mockData);


  const handleSearch = (query: string) => {
    // Filter data based on search query
    if (query) {
      const filtered = mockData.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      // If no search query, show all data
      setFilteredData(mockData);
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
  },
  greetingText: {
    fontSize: FontSize.large,
    fontWeight: '600',
  },
});

export default HomeScreen;
