import React, {useState, useCallback} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {FontSize, Spacing} from '../../utils/dimension';
import {RootState} from 'redux/store';
import {useSelector, useDispatch} from 'react-redux';
import {getUserServices} from '../../services/serviceProviderService';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'interfaces';
import CustomServiceCards from '../../components/CustomServiceCard';
import {ErrorResponse, ServiceDetails} from 'interfaces';
import {ApiResponse} from '../../services/apiClient';
import {showSnackbar} from '../../redux/snackbarSlice';
import {FallBack} from '../../components/FallBack';
import {globalStyle} from '../../utils/globalStyle';
import {COLORS} from '../../utils/globalConstants/color';
import {WORD_DIR} from '../../utils/local/en';
import {apiWithLoader} from '../../utils/apiWithLoader';
import {getErrorMessage} from '../../utils/errorHandler';

const MyServices: React.FC = () => {
  // const { serviceId } = route.params;
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails[] | null>(
    null,
  );
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const fetchService = useCallback(async (): Promise<void> => {
    if (!user?.id) {
      console.error('User ID not available');
      return;
    }

    const response: ApiResponse<ServiceDetails[]> | ErrorResponse =
      await apiWithLoader(
        () =>
          getUserServices({
            id: user.id,
          }),
        'Loading services...',
      );

    if (response.success && response.data) {
      setServiceDetails(response.data);
    } else {
      dispatch(
        showSnackbar({
          message: getErrorMessage(
            response,
            'Failed to load services. Please try again.',
          ),
          success: false,
        }),
      );
    }
  }, [user?.id, dispatch]);

  useFocusEffect(
    useCallback(() => {
      fetchService();
    }, [fetchService]),
  );

  if (!serviceDetails) return null;

  return (
    <View style={globalStyle.globalContainer}>
      {serviceDetails && serviceDetails?.length > 0 ? (
        <View>
          <FlatList
            data={serviceDetails}
            keyExtractor={item => item.id || ''}
            renderItem={({item}) => (
              <CustomServiceCards
                item={item}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <FallBack
          imageSrc={require('../../assets/error-in-calendar.png')}
          heading={WORD_DIR.createServiceFirst}
          navigationRoute="Tabs"
        />
      )}
    </View>
  );
};

export default MyServices;
