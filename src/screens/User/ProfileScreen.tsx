import React, {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {Screen, Spacing, FontSize} from '../../utils/dimension';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../../utils/globalConstants/color';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'interfaces';
import {RootState} from '../../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import CustomText from '../../components/CustomText';
import {WORD_DIR} from '../../utils/local/en';
import {MenuItemProps} from 'interfaces';
import {logout} from '../../redux/authSlice';
import {globalStyle} from '../../utils/globalStyle';
import CustomAvatar from '../../components/CustomAvatar';

const ProfileScreen: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <CustomText style={styles.errorText} label={WORD_DIR.userNotFound} />
        </View>
      </SafeAreaView>
    );
  }

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    avatarUri,
    isServiceProvider,
  } = user;

  const menuItems = useMemo(() => {
    const items = [
      {
        label: 'Transaction History',
        icon: 'receipt',
        routeName: 'Transaction History',
      },
      {
        label: 'Settings',
        icon: 'settings',
        routeName: 'Settings',
      },
      {label: 'Privacy Policy', icon: 'policy'},
      {
        label: 'Log out',
        icon: 'power-settings-new',
        callback: () => dispatch(logout()),
      },
    ];

    if (!isServiceProvider) {
      items.splice(1, 0, {
        label: 'Enroll As Service Provider',
        icon: 'person-add',
        routeName: 'Enrollment',
      });
    } else {
      items.splice(1, 0, {
        label: 'My Services',
        icon: 'event',
        routeName: 'MyService',
      });
      items.splice(2, 0, {
        label: 'Approve events',
        icon: 'event-note',
        routeName: 'BookedEvents',
      });
      items.splice(3, 0, {
        label: 'Upcoming events',
        icon: 'event-available',
        routeName: 'UpcomingEvents',
      });
      items.splice(4, 0, {
        label: 'Past events',
        icon: 'event-repeat',
        routeName: 'PastEvents',
      });
    }

    return items;
  }, [dispatch, isServiceProvider]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <CustomText style={styles.headerTitle} label="Profile" />
            <TouchableOpacity
              onPress={() => navigation.navigate('Edit Profile' as any)}
              accessibilityLabel="Edit Profile">
              <Icon name="edit" size={FontSize.large} color={COLORS.black} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <CustomAvatar
              name={`${firstName} ${lastName}`}
              imageUrl={avatarUri}
              size={120}
              borderColor={COLORS.primary}
              borderWidth={4}
            />
            <View style={styles.onlineIndicator} />
          </View>

          <View style={styles.userInfo}>
            <CustomText
              style={styles.userName}
              label={`${firstName} ${lastName}`}
            />
            <View style={styles.userTypeContainer}>
              <Icon
                name={isServiceProvider ? 'business' : 'person'}
                size={16}
                color={COLORS.primary}
              />
              <CustomText
                style={styles.userType}
                label={isServiceProvider ? 'Service Provider' : 'User'}
              />
            </View>
          </View>

          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Icon name="email" size={20} color={COLORS.gray} />
              <CustomText style={styles.contactText} label={email} />
            </View>
            <View style={styles.contactItem}>
              <Icon name="phone" size={20} color={COLORS.gray} />
              <CustomText style={styles.contactText} label={phoneNumber} />
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <CustomText style={styles.sectionTitle} label="Quick Actions" />
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              label={item.label}
              icon={item.icon}
              callback={
                item.routeName
                  ? () => navigation.navigate(item.routeName as any)
                  : item.callback
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({label, icon, callback}) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={callback}
    accessibilityLabel={label}>
    <View style={[styles.menuIcon]}>
      <Icon name={icon} size={FontSize.large} color={COLORS.black} />
    </View>
    <View style={styles.menuContent}>
      <CustomText style={styles.menuLabel} label={label} />
      <Icon name="chevron-right" size={20} color={COLORS.gray} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSize.extraLarge,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  profileSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: Spacing.small,
    marginTop: Spacing.large,
    borderRadius: 20,
    padding: Spacing.medium,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: Spacing.large,
    position: 'relative',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 8,
    right: '50%',
    marginRight: -60,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.success,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: Spacing.large,
  },
  userName: {
    fontSize: FontSize.extraLarge,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: Spacing.small,
  },
  userTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    borderRadius: 20,
  },
  userType: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: Spacing.small,
  },
  contactInfo: {
    gap: Spacing.medium,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.small,
  },
  contactText: {
    fontSize: FontSize.medium,
    color: COLORS.gray,
    marginLeft: Spacing.medium,
    flex: 1,
  },
  menuSection: {
    marginHorizontal: Spacing.small,
    marginTop: Spacing.large,
    marginBottom: Spacing.extraLarge,
  },
  sectionTitle: {
    fontSize: FontSize.large,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: Spacing.medium,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: Spacing.medium,
    marginBottom: Spacing.small,
    borderRadius: 16,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.medium,
  },
  menuContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuLabel: {
    fontWeight: '600',
    fontSize: FontSize.medium,
    color: COLORS.black,
  },
  textStyle: {
    fontWeight: '400',
    fontSize: FontSize.medium,
    color: COLORS.black,
  },
  errorText: {
    fontSize: FontSize.large,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: Spacing.large,
  },
});

export default ProfileScreen;
