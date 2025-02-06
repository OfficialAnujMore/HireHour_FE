import React, {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Screen, Spacing, FontSize} from '../../utils/dimension';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../../utils/globalConstants/color';
import {useNavigation} from '@react-navigation/native';
import {RootState} from '../../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import CustomText from '../../components/CustomText';
import {WORD_DIR} from '../../utils/local/en';
import {MenuItemProps} from 'interfaces';

const ProfileScreen: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  if (!user) {
    return (
      <View style={styles.container}>
        <CustomText style={styles.errorText} label={WORD_DIR.userNotFound} />
      </View>
    );
  }

  const {name, email, phoneNumber, avatarUri, isServiceProvider} = user;

  const menuItems = useMemo(() => {
    const items = [
      {label: 'Transaction History', icon: 'receipt-outline'},
      {
        label: 'Settings',
        icon: 'settings-outline',
        callback: () => navigation.navigate('Settings'),
      },
      {label: 'Privacy Policy', icon: 'lock-closed-outline'},
      {
        label: 'Log out',
        icon: 'power-outline',
        callback: () => dispatch(logout()),
      },
    ];

    if (!isServiceProvider) {
      items.splice(2, 0, {
        label: 'Enroll As Service Provider',
        icon: 'person-add',
        callback: () => navigation.navigate('Enroll'),
      });
    } else {
      items.splice(2, 0, {
        label: 'My Services',
        icon: 'briefcase-outline',
        callback: () => navigation.navigate('MyService'),
      });
    }

    return items;
  }, [navigation, dispatch, isServiceProvider]);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.editItemContainer}
        onPress={() => navigation.navigate('EditProfile')}
        accessibilityLabel="Edit Profile">
        <Icon name="pencil" size={FontSize.large} color={COLORS.black} />
      </TouchableOpacity>

      <View style={styles.profileContainer}>
        {avatarUri ? (
          <Image
            source={{uri: avatarUri}}
            style={styles.avatar}
            accessibilityLabel="User Avatar"
          />
        ) : (
          <View style={[styles.avatar, styles.iconFallback]}>
            <Icon
              name="person-outline"
              size={FontSize.extraLarge * 1.5}
              color={COLORS.grey}
            />
          </View>
        )}
        <CustomText style={[styles.textStyle, styles.name]} label={name} />
        <CustomText style={styles.textStyle} label={email} />
        <CustomText style={styles.textStyle} label={phoneNumber} />
      </View>

      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          label={item.label}
          icon={item.icon}
          callback={item.callback}
        />
      ))}
    </ScrollView>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({label, icon, callback}) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={callback}
    accessibilityLabel={label}>
    <View style={styles.menuIcon}>
      <Icon name={icon} size={FontSize.large} color={COLORS.black} />
    </View>
    <CustomText style={styles.textStyle} label={label} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.medium,
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
    backgroundColor: COLORS.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconFallback: {
    borderWidth: 1,
    borderColor: COLORS.grey,
  },
  name: {
    fontSize: FontSize.large,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: Spacing.medium,
    marginVertical: Spacing.small,
    borderRadius: Screen.moderateScale(8),
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    width: Screen.moderateScale(40),
    height: Screen.moderateScale(40),
    borderRadius: Screen.moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.medium,
  },
  textStyle: {
    fontWeight: '400',
    fontSize: FontSize.medium,
    color: COLORS.black,
  },
  editItemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: Spacing.medium,
  },
  errorText: {
    fontSize: FontSize.large,
    color: COLORS.red,
    textAlign: 'center',
    marginTop: Spacing.large,
  },
});

export default ProfileScreen;
