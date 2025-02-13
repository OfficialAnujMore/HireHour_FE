import React, {useState, useCallback} from 'react';
import {View, FlatList, StyleSheet, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import CustomSearchBar from '../../components/CustomSearchBar';
import CustomText from '../../components/CustomText';
import {FontSize, Screen, Spacing} from '../../utils/dimension';
import {getGreeting} from '../../utils/globalFunctions';
import {getServiceProviders} from '../../services/serviceProviderService';
import {useFocusEffect} from '@react-navigation/native';
import {User} from 'interfaces';
import CustomServiceCards from '../../components/CustomServiceCard';
import {FallBack} from '../../components/FallBack';
import dataNotFound from '../../assets/error-in-calendar.png';
import {WORD_DIR} from '../../utils/local/en';
import {MAX_SCHEDULE_DISPLAY} from '../../utils/constants';

const HomeScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [data, setData] = useState<User[]>([]);
  const [filteredData, setFilteredData] = useState<User[]>([]);

  // Function to fetch service providers
  const fetchServiceProviders = useCallback(async () => {
    try {
      const categories = ['Photography', 'Guitar', 'Art', 'Music'];
      const response = await getServiceProviders(user?.id, categories);
      console.log('Service data', response.data);
      
      setData(response.data);
      setFilteredData(response.data); // Set filtered data as the default
    } catch (error) {
      console.error('Error fetching service providers:', error);
    }
  }, [user?.id]);

  // Use `useFocusEffect` to call the API whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchServiceProviders();
    }, [fetchServiceProviders]),
  );

  // Search handler
  const handleSearch = (query: string) => {
    if (query) {
      const filtered = data.filter(
        item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data); // Reset filtered data to the full data if no query
    }
  };

  return (
    <View style={styles.container}>
      <CustomSearchBar onSearch={handleSearch} />
      <CustomText
        label={`${getGreeting()}, ${user?.firstName}`}
        style={styles.greetingText}
      />

      {filteredData?.length > 0 ? (
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <CustomServiceCards
              item={item}
              maxDisplay={MAX_SCHEDULE_DISPLAY}
              handlePress={() => {
                navigation.navigate('ServiceDetails', item);
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FallBack imageSrc={dataNotFound} heading={WORD_DIR.noService} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: Spacing.small,
    backgroundColor: '#f6f6f6',
    paddingBottom: Screen.height / 30,
  },
  greetingText: {
    fontSize: FontSize.large,
    fontWeight: '600',
  },
  dataNotFound: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: FontSize.large,
    fontWeight: '600',
  },
});

export default HomeScreen;
