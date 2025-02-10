import {useSelector, useDispatch} from 'react-redux';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import {RootState} from 'redux/store';
import CustomServiceCards from '../../components/CustomServiceCard';
import {FontSize, Screen, Spacing} from '../../utils/dimension';
import CustomButton from '../../components/CustomButton';
import {
  clearCart,
  removeScheduleFromCart,
  removeServiceFromCart,
} from '../../redux/cartSlice';
import {bookService} from '../../services/serviceProviderService';
import {showSnackbar} from '../../redux/snackbarSlice';
import PaymentModal from '../../components/PaymentModal';
import CustomPaymentSummary from '../../components/CustomPaymentSummary';
import {COLORS} from '../../utils/globalConstants/color';
import CustomText from '../../components/CustomText';
import emptyCart from '../../assets/empty-cart.png';
import {useNavigation} from '@react-navigation/native';
export const CartScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const [modalVisible, setModalVisible] = useState(false);

  const handlePaymentSelect = async (method: string) => {
    const schedule = cartItems.flatMap(service => {
      return service.schedule;
    });

    const response = await bookService({
      userId: user?.id,
      schedule: schedule,
    });

    if (response.success) {
      dispatch(showSnackbar(response.message));
      dispatch(clearCart());
    }

    Alert.alert('Payment Selected', `You chose: ${method}`);
    setModalVisible(false);
  };
  const handleRemoveService = (serviceId: string) => {
    dispatch(removeServiceFromCart(serviceId)); // This will automatically update the state and re-render the component
  };

  const handleRemoveScheduledDate = (serviceId: string, scheduleId: string) => {
    dispatch(removeScheduleFromCart({serviceId, scheduleId}));
  };

  const handlePress = async () => {
    setModalVisible(true);
  };
  return (
      <ScrollView>
        <CustomText style={styles.sectionTitle} label={'Order Summary'} />

        {cartItems?.length === 0 ? (
          <View style={styles.container}>

  
          <View style={styles.emptyCartContainer}>
            <View style={{alignItems: 'center'}}>
              <Image source={emptyCart} />

              <CustomText
                style={styles.emptyText}
                label={'Your cart is empty!'}
              />
              <CustomText
                style={styles.emptyText}
                label={'Choose a service and proceed to checkout'}
              />
            </View>
          
          </View>
          <CustomButton
              label={'Go to home'}
              onPress={() => {
                navigation.navigate('Home');
              }}
            />
          </View>
        ) : (
          <View style={styles.container}>
            {cartItems.map(item => {
              return (
                <CustomServiceCards
                  key={item.id}
                  item={item}
                  handleRemoveService={handleRemoveService}
                  handleRemoveScheduledDate={handleRemoveScheduledDate}
                />
              );
            })}
            <CustomPaymentSummary
              amount={'10'}
              tax={'0.2'}
              totalAmount={'12.0'}
            />
            <CustomButton label={'Proceed to checkout'} onPress={handlePress} />
          </View>
        )}

        <PaymentModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          onPaymentSelect={handlePaymentSelect}
        />

      </ScrollView>
  );
};

const styles = StyleSheet.create({
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  emptyCartContainer: {
    flex: 1,
    // height:Screen.height,
    justifyContent: 'center',
    // alignItems: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    paddingHorizontal: Spacing.small,
  },
  sectionTitle: {
    fontSize: FontSize.large,
    fontWeight: 'bold',
    marginVertical: Spacing.medium,
    marginHorizontal: Spacing.medium,
  },
  orderContainer: {
    // flexDirection:'row',
    marginHorizontal: Spacing.medium,
  },
  orderItem: {
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: Screen.moderateScale(8),
    padding: Spacing.medium,
    marginBottom: Spacing.small,
  },
  orderImage: {
    width: Screen.moderateScale(60),
    height: Screen.moderateScale(60),
    borderRadius: Screen.moderateScale(8),
  },
  orderDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderDetails: {
    // flex: 1,
    marginHorizontal: Spacing.medium,
  },
  orderTitle: {
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    color: '#333',
  },
  orderMeta: {
    fontSize: FontSize.small,
    color: '#666',
  },
  orderPriceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    color: '#333',
  },
  viewScheduleText: {
    fontSize: FontSize.small,
    color: '#03A9F4',
    marginTop: Spacing.small,
  },
  scheduleItem: {
    borderRadius: Screen.moderateScale(8),
    padding: Spacing.medium,
    marginBottom: Spacing.small,
  },
  scheduleTitle: {
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    color: '#333',
  },
  scheduleTimeSlot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.small,
  },
  scheduleTime: {
    fontSize: FontSize.small,
    color: '#666',
  },
  availability: {
    fontSize: FontSize.small,
    color: '#03A9F4',
  },
  offersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.medium,
    backgroundColor: '#FFFFFF',
    marginTop: Spacing.medium,
  },
  couponsText: {
    fontSize: FontSize.medium,
    color: '#333',
  },
  offerCount: {
    fontSize: FontSize.medium,
    color: '#03A9F4',
  },
  paymentSummaryContainer: {
    padding: Spacing.medium,
    marginTop: Spacing.medium,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Spacing.small,
  },
  paymentLabel: {
    fontSize: FontSize.medium,
    color: '#666',
  },
  paymentValue: {
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    color: '#333',
  },
});
