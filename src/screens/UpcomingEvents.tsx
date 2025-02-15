import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Image, Text} from 'react-native';
import CustomText from '../components/CustomText';
import {getUpcomingEvents} from '../services/serviceProviderService';
import {useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {useFocusEffect} from '@react-navigation/native';
import {WORD_DIR} from '../utils/local/en';
import CustomServiceCards from '../components/CustomServiceCard';
import {FallBack} from '../components/FallBack';
import dataNotFound from '../assets/error-in-calendar.png';
import {globalStyle} from '../utils/globalStyle';
import {ApiResponse} from 'services/apiClient';
import {ErrorResponse, ServiceDetails} from 'interfaces';
import {useDispatch} from 'react-redux';
import {showSnackbar} from 'redux/snackbarSlice';
const UpcomingEvents = ({}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [data, setData] = useState();
  const dispatch = useDispatch();

  const apiCall = async (): Promise<void> => {
    const response: ApiResponse<ServiceDetails[]> | ErrorResponse =
      await getUpcomingEvents({
        userId: user?.id,
      });

    if (response.success && response.data) {
      setData(response.data);
    } else {
      dispatch(
        showSnackbar({
          message: response.message,
          success: false,
        }),
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      apiCall();
    }, []),
  );

  return (
    <View style={globalStyle.globalContainer}>
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
        <FallBack
          imageSrc={dataNotFound}
          heading={WORD_DIR.noUpcomingEvents}
          subHeading={WORD_DIR.scheduleEvent}
          buttonLabel={WORD_DIR.goHome}
          navigationRoute="Home"
        />
      )}
    </View>
  );
};

export default UpcomingEvents;
