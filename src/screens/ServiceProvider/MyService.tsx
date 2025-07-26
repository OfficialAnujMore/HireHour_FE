import React, {useState,  useCallback} from 'react';
import {View, StyleSheet,  FlatList} from 'react-native';
import {FontSize,  Spacing} from '../../utils/dimension';
import {RootState} from 'redux/store';
import {useSelector, useDispatch} from 'react-redux';
import {getUserServices} from '../../services/serviceProviderService';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import CustomServiceCards from '../../components/CustomServiceCard';
import {ErrorResponse, ServiceDetails} from 'interfaces';
import {ApiResponse} from '../../services/apiClient';
import {showSnackbar} from '../../redux/snackbarSlice';
import {FallBack} from '../../components/FallBack';
import {globalStyle} from '../../utils/globalStyle';

const MyServices = () => {
  // const { serviceId } = route.params;
  const [serviceDetails, setServiceDetails] = useState(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const fetchService = async (): Promise<void> => {
    const response: ApiResponse<ServiceDetails> | ErrorResponse =
      await getUserServices({
        id: user?.id,
      });

    if (response.success && response.data) {
      setServiceDetails(response.data);
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
      fetchService();
    }, []),
  );

  if (!serviceDetails) return null;

  return (
    <View style={globalStyle.globalContainer}>
      {serviceDetails && serviceDetails?.length > 0 ? (
        <View>
          <FlatList
            data={serviceDetails}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <CustomServiceCards
                item={item}
                handlePress={() => {
                  navigation.navigate('ServiceDetails', item);
                }}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <FallBack
          imageSrc={require('../../assets/error-in-calendar.png')}
          heading="Kindly create a service first before continuing!"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.medium,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: FontSize.large,
    fontWeight: 'bold',
    marginBottom: Spacing.small,
  },
  text: {
    fontSize: FontSize.medium,
    marginBottom: Spacing.small,
  },
  subHeading: {
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    marginTop: Spacing.medium,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.medium,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
  scheduleItem: {
    marginBottom: Spacing.small,
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

export default MyServices;
