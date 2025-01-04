import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { logout, RootState } from '../redux/store';
const HomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const handlePress = () => {
    Alert.alert('Button Pressed!');
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen {user?.name}</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
        <Button
        title="Logout"
        onPress={()=>{
          dispatch(logout())
        }}
      />
    </View>
  );
}

export default HomeScreen;
