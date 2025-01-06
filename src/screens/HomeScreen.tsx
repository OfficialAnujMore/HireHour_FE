import React from 'react';
import { View, Text, Button, Alert, FlatList, StyleSheet } from 'react-native';;
import { useDispatch, useSelector } from 'react-redux';
import { logout, RootState } from '../redux/store';
import CustomSearchBar from '../components/CustomSearchBar';
import CustomCards from '../components/CustomCards';
import CustomText from '../components/CustomText';
import { FontSize, Spacing } from '../utils/dimension';
const HomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const handlePress = () => {
    Alert.alert('Button Pressed!');
  };
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
      image: 'https://via.placeholder.com/150', // Replace with actual image
      previewImages: [
        'https://plus.unsplash.com/premium_photo-1701590725747-ac131d4dcffd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2Vic2l0ZSUyMGJhbm5lcnxlbnwwfHwwfHx8MA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1701590725824-3d0482721544?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d2Vic2l0ZSUyMGJhbm5lcnxlbnwwfHwwfHx8MA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1701590725747-ac131d4dcffd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2Vic2l0ZSUyMGJhbm5lcnxlbnwwfHwwfHx8MA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1701590725824-3d0482721544?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d2Vic2l0ZSUyMGJhbm5lcnxlbnwwfHwwfHx8MA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1701590725747-ac131d4dcffd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2Vic2l0ZSUyMGJhbm5lcnxlbnwwfHwwfHx8MA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1701590725824-3d0482721544?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d2Vic2l0ZSUyMGJhbm5lcnxlbnwwfHwwfHx8MA%3D%3D',
        
      ]
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
      image: 'https://via.placeholder.com/150', // Replace with actual image
      previewImages: [
        'https://plus.unsplash.com/premium_photo-1701590725747-ac131d4dcffd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2Vic2l0ZSUyMGJhbm5lcnxlbnwwfHwwfHx8MA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1701590725824-3d0482721544?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d2Vic2l0ZSUyMGJhbm5lcnxlbnwwfHwwfHx8MA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1701590725747-ac131d4dcffd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2Vic2l0ZSUyMGJhbm5lcnxlbnwwfHwwfHx8MA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1701590725824-3d0482721544?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d2Vic2l0ZSUyMGJhbm5lcnxlbnwwfHwwfHx8MA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1701590725747-ac131d4dcffd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d2Vic2l0ZSUyMGJhbm5lcnxlbnwwfHwwfHx8MA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1701590725824-3d0482721544?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d2Vic2l0ZSUyMGJhbm5lcnxlbnwwfHwwfHx8MA%3D%3D',
        
      ]
    },
    // Add more items for 10 total
  ];

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Hello';
    }
  };
  return (
    <View style={styles.container}>
      <CustomSearchBar onSearch={(item) => {
        console.log(item);
      }} />
      <CustomText label={`${getGreeting()}, ${user?.name}`} style={styles.greetingText}/>

      <FlatList
        data={mockData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CustomCards item={item} />}
      // contentContainerStyle={styles.listContainer}
      />

    
      <Button
        title="Logout"
        onPress={() => {
          dispatch(logout())
        }}
      />
    </View>
  );
}

const styles=StyleSheet.create({
  container:{
    flex:1,
    margin:Spacing.small
  },
  greetingText:{
    fontSize:FontSize.large,
    fontWeight:'600',
  }
})

export default HomeScreen;
