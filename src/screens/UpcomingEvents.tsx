import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Image} from 'react-native';
import CustomText from '../components/CustomText';
import {getUpcomingEvents} from '../services/serviceProviderService';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import CustomEventCard from '../components/CustomEventCard';
import {useFocusEffect} from '@react-navigation/native';
import {WORD_DIR} from '../utils/local/en';
import {FontSize, Screen} from '../utils/dimension';
const UpcomingEvents = ({}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [data, setData] = useState();

  const apiCall = async () => {
    console.log('APoi called');

    const response = await getUpcomingEvents({userId: user?.id});
    console.log('getUpcomingEvents', response);

    setData(response?.data);
  };
  useFocusEffect(
    useCallback(() => {
      apiCall();
    }, []),
  );

  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <View style={styles.container}>
      {data && data?.length > 0 ? (
        <View>
          <CustomText label={WORD_DIR.upcomingEvents} />
          <FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <CustomEventCard
                item={item}
                handlePress={() => {
                  // navigation.navigate("ServiceDetails", item)
                }}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <View style={styles.dataNotFound}>
          <Image
            source={require('../assets/error-in-calendar.png')}
            style={{width: Screen.width, height: Screen.height / 2}}
          />
          <CustomText style={styles.noDataText} label={'No upcoming events'} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: 0},
  dataNotFound: {
    height:Screen.height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: FontSize.large,
    fontWeight: '600',
  },
});
export default UpcomingEvents;
