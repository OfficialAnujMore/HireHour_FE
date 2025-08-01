import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  RefreshControl,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import CustomSearchBar from '../../components/CustomSearchBar';
import CustomText from '../../components/CustomText';
import {FontSize, Screen, Spacing} from '../../utils/dimension';
import {getGreeting} from '../../utils/globalFunctions';
import {getServiceProviders} from '../../services/serviceProviderService';
import {useFocusEffect} from '@react-navigation/native';
import {ErrorResponse, ServiceDetails, User} from 'interfaces';
import CustomServiceCards from '../../components/CustomServiceCard';
import {FallBack} from '../../components/FallBack';
import dataNotFound from '../../assets/error-in-calendar.png';
import {WORD_DIR} from '../../utils/local/en';
import {SCHEDULE} from '../../utils/constants';
import {showSnackbar} from '../../redux/snackbarSlice';
import {ApiResponse} from '../../services/apiClient';
import {COLORS} from '../../utils/globalConstants/color';
import {globalStyle} from '../../utils/globalStyle';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  PermissionStatus,
} from 'react-native-permissions';
import PushNotification from 'react-native-push-notification';
import {upsertFCMToken} from '../../services/userService';
import {login} from '../../redux/authSlice';
import {PLACEHOLDER_DIR} from '../../utils/local/placeholder';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'interfaces';
import {apiWithLoader} from '../../utils/apiWithLoader';
import {getErrorMessage} from '../../utils/errorHandler';
import SearchFilterModal, {
  FilterOptions,
} from '../../components/SearchFilterModal';

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [data, setData] = useState<ServiceDetails[]>([]);
  const [filteredData, setFilteredData] = useState<ServiceDetails[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({
    priceRange: [0, 1000],
    selectedCategories: [],
    searchQuery: '',
  });

  // Memoize the categories array to prevent recreation on every render
  const categories = useMemo(
    () => ['Photography', 'Guitar', 'Art', 'Music', 'Sports'],
    [],
  );

  const fetchServiceProviders = useCallback(async (): Promise<void> => {
    if (!user?.id) {
      console.error('User ID not available');
      return;
    }

    const response: ApiResponse<ServiceDetails[]> | ErrorResponse =
      await apiWithLoader(
        () => getServiceProviders(user.id, categories),
        'Loading services...',
      );

    if (response.success && response.data) {
      setData(response.data);
      // Apply current filters to new data
      applyFilters(response.data, currentFilters);
    } else {
      dispatch(
        showSnackbar({
          message: getErrorMessage(
            response,
            'Failed to load services. Please try again.',
          ),
        }),
      );
    }
  }, [user?.id, categories, dispatch, currentFilters]);

  // Function to apply filters to data
  const applyFilters = useCallback(
    (services: ServiceDetails[], filters: FilterOptions) => {
      let filtered = [...services];

      // Apply search query filter
      if (filters.searchQuery) {
        filtered = filtered.filter(
          (item: ServiceDetails) =>
            item.title
              .toLowerCase()
              .includes(filters.searchQuery!.toLowerCase()) ||
            item.description
              .toLowerCase()
              .includes(filters.searchQuery!.toLowerCase()),
        );
      }

      // Apply category filter
      if (filters.selectedCategories.length > 0) {
        filtered = filtered.filter((item: ServiceDetails) =>
          filters.selectedCategories.includes(item.category),
        );
      }

      // Apply price range filter
      filtered = filtered.filter((item: ServiceDetails) => {
        const price = parseFloat(item.pricing?.toString() || '0');
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });

      setFilteredData(filtered);
    },
    [],
  );

  // Optimize useFocusEffect to only run when necessary
  useFocusEffect(
    useCallback(() => {
      fetchServiceProviders();
    }, [fetchServiceProviders]),
  );

  // Clear search when screen loses focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        // Clear search when navigating away
        setSearchQuery('');
        setCurrentFilters({
          priceRange: [0, 1000],
          selectedCategories: [],
          searchQuery: '',
        });
        setFilteredData(data);
      };
    }, [data]),
  );

  // Memoize search handler to prevent recreation
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      const newFilters = {
        ...currentFilters,
        searchQuery: query,
      };
      setCurrentFilters(newFilters);
      applyFilters(data, newFilters);
    },
    [data, currentFilters, applyFilters],
  );

  // Handle filter modal open
  const handleFilterPress = useCallback(() => {
    setShowFilterModal(true);
  }, []);

  // Handle filter apply
  const handleApplyFilters = useCallback(
    (filters: FilterOptions) => {
      setCurrentFilters(filters);
      setSearchQuery(filters.searchQuery || '');
      applyFilters(data, filters);
    },
    [data, applyFilters],
  );

  // Memoize FCM token function
  const getFCMToken = useCallback(async () => {
    const fcmToken = await messaging().getToken();

    if (fcmToken) {
      const res = await upsertFCMToken({
        userId: user?.id,
        fcmToken: fcmToken,
      });
      dispatch(login({user: res.data}));
    }
  }, [user?.id, dispatch]);

  const askNotificationPermission =
    useCallback(async (): Promise<PermissionStatus> => {
      let permission: any = null;

      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          getFCMToken();
          return RESULTS.GRANTED;
        } else {
          console.warn('iOS notification permission denied');
          return RESULTS.DENIED;
        }
      } else if (Platform.OS === 'android' && Platform.Version >= 33) {
        permission = 'android.permission.POST_NOTIFICATIONS';
      }

      if (!permission) {
        getFCMToken();
        return RESULTS.GRANTED;
      }

      const result = await check(permission);

      if (result === RESULTS.GRANTED) {
        getFCMToken();
        return result;
      }

      const newStatus = await request(permission);

      if (newStatus === RESULTS.GRANTED) {
        getFCMToken();
      } else {
        console.warn('Notification permission denied or blocked');
      }

      return newStatus;
    }, [getFCMToken]);

  const createNotificationChannel = useCallback(() => {
    if (Platform.OS === 'android' && Platform.Version >= 26) {
      PushNotification.createChannel(
        {
          channelId: 'default-channel',
          channelName: 'Default Channel',
          channelDescription: 'A default channel for notifications',
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        (created: any) => {
          // Create channel returned ${created}
        },
      );
    }
  }, []);

  useEffect(() => {
    createNotificationChannel();
    askNotificationPermission();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.notification) {
        PushNotification.localNotification({
          channelId: 'default-channel',
          title: remoteMessage.notification?.title || 'Notification',
          message: remoteMessage.notification?.body || 'No message',
          date: new Date(),
        });
      }
    });

    return () => unsubscribe();
  }, [createNotificationChannel]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchServiceProviders();
    setIsRefreshing(false);
  }, [fetchServiceProviders]);

  // Memoize the render item function
  const renderItem = useCallback(
    ({item}: {item: ServiceDetails}) => <CustomServiceCards item={item} />,
    [navigation],
  );

  // Memoize the key extractor
  const keyExtractor = useCallback(
    (item: ServiceDetails) => item.userId || item.id || '',
    [],
  );

  // Memoize the empty component
  const EmptyComponent = useMemo(
    () => (
      <FallBack
        imageSrc={dataNotFound}
        heading={WORD_DIR.noService}
        subHeading=""
      />
    ),
    [],
  );

  return (
    <>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.greetingContainer}>
            <CustomText style={styles.greeting} label={`${getGreeting()},`} />
            <CustomText
              style={styles.userName}
              label={user?.firstName || 'User'}
            />
          </View>
          <CustomText
            style={styles.subtitle}
            label="Discover amazing services from talented providers"
            numberOfLines={3}
          />
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <CustomSearchBar
            placeholder={PLACEHOLDER_DIR.PLACEHOLDER_SEARCH}
            onChange={handleSearch}
            value={searchQuery}
            onFilterPress={handleFilterPress}
          />
        </View>

        {/* Services Section */}
        <View style={styles.servicesSection}>
          <View style={styles.sectionHeader}>
            <CustomText
              style={styles.sectionTitle}
              label="Available Services"
            />
            <CustomText
              style={styles.serviceCount}
              label={`${filteredData.length} service${
                filteredData.length !== 1 ? 's' : ''
              } found`}
            />
          </View>

          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={EmptyComponent}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }
          />
        </View>
      </View>

      {/* Search Filter Modal */}
      <SearchFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilters}
        currentFilters={currentFilters}
      />
    </>
  );
};

HomeScreen.displayName = 'HomeScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerSection: {
    paddingTop: Spacing.large,
    paddingHorizontal: Spacing.medium,
    paddingBottom: Spacing.medium,
    backgroundColor: COLORS.white,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.small,
  },
  greeting: {
    fontSize: FontSize.large,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: Spacing.small,
  },
  userName: {
    fontSize: FontSize.large + 2,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  subtitle: {
    fontSize: FontSize.medium,
    color: COLORS.gray,
    lineHeight: 22,
  },
  searchSection: {
    paddingHorizontal: Spacing.medium,
    paddingBottom: Spacing.medium,
    backgroundColor: COLORS.white,
  },
  servicesSection: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.medium,
    paddingBottom: Spacing.medium,
  },
  sectionTitle: {
    fontSize: FontSize.large,
    fontWeight: '600',
    color: COLORS.black,
  },
  serviceCount: {
    fontSize: FontSize.small,
    color: COLORS.gray,
  },
  listContainer: {
    paddingHorizontal: Spacing.medium,
    paddingBottom: Spacing.large,
  },
});

export default HomeScreen;
