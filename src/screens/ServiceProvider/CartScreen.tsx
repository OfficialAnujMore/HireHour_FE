import {useSelector, useDispatch} from 'react-redux';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  TouchableOpacity,
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
import CustomText from '../../components/CustomText';
import emptyCart from '../../assets/empty-cart.png';
import {useNavigation} from '@react-navigation/native';
import {FallBack} from '../../components/FallBack';
import {WORD_DIR} from '../../utils/local/en';
import {ApiResponse} from 'services/apiClient';
import {ErrorResponse, ServiceDetails} from 'interfaces';
import {COLORS} from '../../utils/globalConstants/color';
import {apiWithLoader} from '../../utils/apiWithLoader';
import {getErrorMessage} from '../../utils/errorHandler';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState(0.0);

  useEffect(() => {
    const amt = cartItems.reduce((total, item) => {
      const itemPrice = parseFloat(item.pricing) || 0;
      const scheduleCount = item.schedule.length || 0;
      return total + itemPrice * scheduleCount;
    }, 0);
    // Round to 2 decimal places
    setAmount(Math.round(amt * 100) / 100);
  }, [cartItems]);

  const [paymentDetails, setPaymentDetails] = useState({
    amount: 0.0,
    tax: 0.0,
    totalAmount: 0.0,
    taxRate: 20.0,
  });

  const calculateTotalAmount = (amount: number, taxRate: number = 20) => {
    // Round to 2 decimal places to avoid floating point precision issues
    const roundedAmount = Math.round(amount * 100) / 100;
    const tax = Math.round(((roundedAmount * taxRate) / 100) * 100) / 100;
    const totalAmount = Math.round((roundedAmount + tax) * 100) / 100;

    setPaymentDetails(prevDetails => ({
      ...prevDetails,
      amount: roundedAmount,
      tax,
      totalAmount,
      taxRate,
    }));
  };

  useEffect(() => {
    calculateTotalAmount(Number(amount));
  }, [amount]);

  const handlePaymentSelect = async ({
    transactionType,
    paymentId,
  }: {
    transactionType: string;
    paymentId: string;
  }): Promise<void> => {
    const updatedPaymentDetails = {
      ...paymentDetails,
      transactionType,
      paymentId,
      paymentStatus: 'pending',
    };

    const data = {
      userId: user?.id,
      cartItems: cartItems,
      paymentDetails: updatedPaymentDetails,
    };

    const response: ApiResponse<ServiceDetails> | ErrorResponse =
      await apiWithLoader(() => bookService(data), 'Processing payment...');

    if (response.success) {
      dispatch(
        showSnackbar({
          message: getErrorMessage(response, 'Payment processed successfully!'),
          success: response.success,
        }),
      );
      dispatch(clearCart());
    } else {
      dispatch(
        showSnackbar({
          message: getErrorMessage(
            response,
            'Payment processing failed. Please try again.',
          ),
          success: false,
        }),
      );
    }
    setModalVisible(false);
  };

  const handleRemoveService = (serviceId: string) => {
    dispatch(removeServiceFromCart(serviceId));
  };

  const handleRemoveScheduledDate = (
    serviceId: string | undefined,
    scheduleId: string,
  ) => {
    if (serviceId) {
      dispatch(removeScheduleFromCart({serviceId, scheduleId}));
    }
  };

  const handlePress = async () => {
    setModalVisible(true);
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => dispatch(clearCart()),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {cartItems?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FallBack
            heading={WORD_DIR.emptyCartHeading}
            subHeading={WORD_DIR.emptyCartSubHeading}
            imageSrc={emptyCart}
          />
        </View>
      ) : (
        <>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <CustomText style={styles.headerTitle} label="Shopping Cart" />
              <View style={styles.cartInfo}>
                <Icon name="shopping-cart" size={20} color={COLORS.primary} />
                <CustomText
                  style={styles.itemCount}
                  label={`${cartItems.length} item${
                    cartItems.length !== 1 ? 's' : ''
                  }`}
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={handleClearCart}
              style={styles.clearButton}>
              <Icon name="delete-sweep" size={20} color={COLORS.error} />
              <CustomText style={styles.clearText} label="Clear" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}>
            {/* Cart Items */}
            <View style={styles.itemsContainer}>
              {cartItems.map((item, index) => (
                <View key={item.id} style={styles.itemWrapper}>
                  <CustomServiceCards
                    item={item}
                    handleRemoveService={handleRemoveService}
                    handleRemoveScheduledDate={handleRemoveScheduledDate}
                    setApprovedSlot={() => {}}
                  />
                  {index < cartItems.length - 1 && (
                    <View style={styles.itemDivider} />
                  )}
                </View>
              ))}
            </View>

            {/* Payment Summary */}
            <View style={styles.summaryContainer}>
              <CustomPaymentSummary paymentDetails={paymentDetails} />
            </View>
          </ScrollView>

          {/* Bottom Action */}
          <View style={styles.bottomContainer}>
            <View style={styles.bottomContent}>
              <View style={styles.totalInfo}>
                <CustomText style={styles.totalLabel} label="Total Amount" />
                <CustomText
                  style={styles.totalAmount}
                  label={`$${paymentDetails.totalAmount.toFixed(2)}`}
                />
                <CustomText
                  style={styles.taxInfo}
                  label={`Includes $${paymentDetails.tax.toFixed(2)} tax (${
                    paymentDetails.taxRate
                  }%)`}
                  numberOfLines={4}
                />
              </View>
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={handlePress}
                activeOpacity={0.8}>
                <View style={styles.buttonContent}>
                  <Icon name="payment" size={20} color={COLORS.white} />
                  <CustomText
                    style={styles.buttonText}
                    label="Proceed to Payment"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      <PaymentModal
        paymentDetails={paymentDetails}
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
    backgroundColor: COLORS.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSize.extraLarge,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 4,
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemCount: {
    fontSize: FontSize.small,
    color: COLORS.gray,
    fontWeight: '500',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearText: {
    fontSize: FontSize.small,
    color: COLORS.error,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  itemsContainer: {
    paddingHorizontal: Spacing.medium,
    paddingTop: Spacing.medium,
  },
  itemWrapper: {
    marginBottom: Spacing.medium,
  },
  itemDivider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: Spacing.medium,
  },
  summaryContainer: {
    paddingHorizontal: Spacing.medium,
    paddingBottom: Spacing.large,
  },
  bottomContainer: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalInfo: {
    flex: 1,
  },
  totalLabel: {
    fontSize: FontSize.small,
    color: COLORS.gray,
    fontWeight: '500',
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: FontSize.medium + 2,
    color: COLORS.primary,
    fontWeight: '700',
  },
  taxInfo: {
    fontSize: FontSize.small - 2,
    color: COLORS.gray,
    fontWeight: '400',
    marginTop: 2,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.medium,
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FontSize.medium,
    fontWeight: '600',
  },
});

export default CartScreen;
