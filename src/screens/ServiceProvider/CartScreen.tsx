import {useSelector, useDispatch} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
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
import CustomText from '../../components/CustomText';
import emptyCart from '../../assets/empty-cart.png';
import {useNavigation} from '@react-navigation/native';
import {FallBack} from '../../components/FallBack';
import {WORD_DIR} from '../../utils/local/en';
import {globalStyle} from '../../utils/globalStyle';
import {ApiResponse} from 'services/apiClient';
import {ErrorResponse, ServiceDetails} from 'interfaces';
export const CartScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState(0.0);
  useEffect(() => {
    console.log(cartItems);

    const amt = cartItems.reduce((total, item) => {
      console.log(item);
      
      return total + Number(item.pricing) * item.schedule.length;
    }, 0);

    console.log(amt);
    setAmount(amt);
  }, [cartItems]);

  const handlePaymentSelect = async (method: string): Promise<void> => {
    const schedule = cartItems.flatMap(service => service.schedule);

    const response: ApiResponse<ServiceDetails> | ErrorResponse =
      await bookService({
        userId: user?.id,
        schedule: schedule,
      });

    if (response.success) {
      dispatch(
        showSnackbar({
          message: response.message,
          success: response.success,
        }),
      );
      dispatch(clearCart());
    } else {
      dispatch(
        showSnackbar({
          message: response.message,
          success: false,
        }),
      );
    }
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
    <View style={globalStyle.globalContainer}>
      {cartItems?.length === 0 ? (
        <FallBack
          heading={WORD_DIR.emptyCartHeading}
          subHeading={WORD_DIR.emptyCartSubHeading}
          imageSrc={emptyCart}
        />
      ) : (
        <ScrollView>
          <View style={{justifyContent: 'space-between'}}>
            <CustomText style={styles.sectionTitle} label={'Order Summary'} />
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
            <CustomPaymentSummary amount={amount} />
          </View>
          <CustomButton label={'Proceed to checkout'} onPress={handlePress} />
        </ScrollView>
      )}

      <PaymentModal
        amount={amount}
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onPaymentSelect={handlePaymentSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
