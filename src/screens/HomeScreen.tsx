import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';


const HomeScreen = ({ navigation }: any) => {
  const handlePress = () => {
    Alert.alert('Button Pressed!');
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* <Text>Home Screen</Text> */}
      <CustomInput
        label="Email"
        placeholder="Enter your email"
        keyboardType="email-address"
        validationRules={[
          { rule: (value) => value.includes('@'), message: 'Must include @ symbol' },
          { rule: (value) => value.length > 5, message: 'Must be longer than 5 characters' },
        ]}
        onValueChange={(value) => console.log('Email:', value)}
      />

      <CustomButton
        label="Submit"
        onPress={handlePress}
        style={{ width: 200 }}
        textStyle={{ fontSize: 18 }}
      />
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

export default HomeScreen;
