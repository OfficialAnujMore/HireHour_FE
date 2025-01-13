import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Screen, Spacing, FontSize } from '../utils/dimension'; // Assuming your dimension code is in a file named dimensions.ts
import Icon from "react-native-vector-icons/Ionicons";
import { COLORS } from '../utils/globalConstants/color';
import { useNavigation } from '@react-navigation/native';
import { logout } from "../redux/store";
import { useDispatch } from "react-redux";
const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const menuItems = [
    { label: 'Transaction History', icon: 'receipt-outline' },
    { label: 'Create Request', icon: 'add' },
    { label: 'Privacy Policy', icon: 'lock-closed-outline' },
    { label: 'Settings', icon: 'settings-outline' },
    { label: 'Enroll As Service Provider', icon: 'person-add' },
    { label: 'Log out', icon: 'power-outline', callback: () => dispatch(logout()) },
  ];
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.editItemContainer} onPress={() => {
        navigation.navigate('EditProfile')
      }}>
        <Icon name={'pencil'} size={FontSize.large} />
      </TouchableOpacity>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://png.pngtree.com/png-clipart/20230927/original/pngtree-man-avatar-image-for-profile-png-image_13001882.png' }} // Replace with the actual avatar URL
          style={styles.avatar}
        />
        <Text style={styles.name}>Robi</Text>
        <Text style={styles.phone}>8967452734</Text>
        <Text style={styles.email}>robi123@gmail.com</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={
            item.callback
          }>
            <View style={styles.menuIcon}>
              <Icon name={item.icon} size={FontSize.large} />
            </View>
            <Text style={styles.menuText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: Spacing.large,
  },
  avatar: {
    width: Screen.moderateScale(100),
    height: Screen.moderateScale(100),
    borderRadius: Screen.moderateScale(50),
    // marginBottom: Spacing.medium,
  },
  name: {
    fontSize: FontSize.large,
    fontWeight: 'bold',
    color: '#333',
  },
  phone: {
    fontSize: FontSize.medium,
    color: '#666',
    marginTop: Spacing.small,
  },
  email: {
    fontSize: FontSize.medium,
    color: '#666',
  },
  menuContainer: {
    marginTop: Spacing.large,
    paddingHorizontal: Spacing.medium,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: Spacing.medium,
    marginVertical: Spacing.small,
    borderRadius: Screen.moderateScale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    width: Screen.moderateScale(40),
    height: Screen.moderateScale(40),
    borderRadius: Screen.moderateScale(20),
    backgroundColor: '#FCE4EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.medium,
  },
  iconPlaceholder: {
    fontSize: FontSize.large,
  },
  menuText: {
    fontSize: FontSize.medium,
    color: '#333',
    flex: 1,
  },
  editItemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.medium,
  },
});

export default ProfileScreen;
