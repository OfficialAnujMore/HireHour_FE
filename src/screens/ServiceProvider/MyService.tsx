import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, Alert, FlatList} from 'react-native';
import {FontSize, Screen, Spacing} from '../../utils/dimension';
import CustomText from '../../components/CustomText';
import {RootState} from 'redux/store';
import {useSelector} from 'react-redux';
import {getUserServices} from '../../services/serviceProviderService';
import {useNavigation} from '@react-navigation/native';
import CustomServiceCards from '../../components/CustomServiceCard';
import {ErrorResponse, ServiceDetails} from 'interfaces';
import {ApiResponse} from 'services/apiClient';
import {useDispatch} from 'react-redux';
import {showSnackbar} from 'redux/snackbarSlice';

const MyServices = () => {
  // const { serviceId } = route.params;
  const [serviceDetails, setServiceDetails] = useState(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  useEffect(() => {
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

    fetchService();
  }, []);

  if (!serviceDetails) return null;

  return (
    <View>
      {serviceDetails && serviceDetails?.length > 0 ? (
        <View>
          <FlatList
            data={serviceDetails}
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
        <View style={styles.dataNotFound}>
          <Image
            source={require('../../assets/error-in-calendar.png')}
            style={{width: Screen.width, height: Screen.height / 2}}
          />
          <CustomText
            style={styles.noDataText}
            label={'Kindly create a service first before continuing!'}
          />
        </View>
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
