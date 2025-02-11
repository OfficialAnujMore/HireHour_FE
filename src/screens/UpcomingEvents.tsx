import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Image, Text} from 'react-native';
import CustomText from '../components/CustomText';
import {getUpcomingEvents} from '../services/serviceProviderService';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import CustomEventCard from '../components/CustomEventCard';
import {useFocusEffect} from '@react-navigation/native';
import {WORD_DIR} from '../utils/local/en';
import {FontSize, Screen} from '../utils/dimension';
import CustomServiceCards from '../components/CustomServiceCard';
import {FallBack} from '../components/FallBack';
import dataNotFound from '../assets/error-in-calendar.png';
const UpcomingEvents = ({}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [data, setData] = useState();

  const apiCall = async () => {
    const response = await getUpcomingEvents({userId: user?.id});
    setData(response?.data);
  };
  useFocusEffect(
    useCallback(() => {
      apiCall();
    }, []),
  );

  return (
    <View style={styles.container}>
      {data && data?.length === 0 ? (
        <View>
          <CustomText label={WORD_DIR.upcomingEvents} />
          <FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <CustomServiceCards
                item={item}
                handlePress={() => {
                  // navigation.navigate('ServiceDetails', item);
                }}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <>
          <FallBack
            imageSrc={dataNotFound}
            heading={WORD_DIR.noUpcomingEvents}
            subHeading={WORD_DIR.scheduleEvent}
            buttonLabel={WORD_DIR.goHome}
            navigationRoute="Home"
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default UpcomingEvents;
