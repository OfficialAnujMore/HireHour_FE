import {useSelector, useDispatch} from 'react-redux';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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

export const CartScreen = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const handleRemoveService = (serviceId: string) => {
    console.log('handleRemoveService called', serviceId);

    dispatch(removeServiceFromCart(serviceId)); // This will automatically update the state and re-render the component
  };

  const handleRemoveScheduledDate = (serviceId: string, scheduleId: string) => {
    console.log(scheduleId, serviceId);
    dispatch(removeScheduleFromCart({serviceId, scheduleId}));
  };

  const handlePress = async () => {
    console.log(cartItems);

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
    console.log(response);
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.sectionTitle}>Your orders</Text>
        {/* <View style={styles.orderContainer}>
      {cartItems.length === 0 ? (
        <Text style={styles.noItemsText}>No items in your cart</Text>
      ) : (
        cartItems.map(item => (
          <View key={item.serviceId} style={styles.orderItem}>
            <View style={styles.orderDetailsContainer}>
              <Image
                source={{
                  uri:
                    item.servicePreview[0]?.imageUri ||
                    'https://via.placeholder.com/60',
                }}
                style={styles.orderImage}
              />
              <View style={styles.orderDetails}>
                <Text style={styles.orderTitle}>{item.title}</Text>
                <Text style={styles.orderMeta}>
                  {item.ratings} ★ | ${item.chargesPerHour}/hr
                </Text>
                <Text style={styles.orderMeta}>{item.description}</Text>

                <TouchableOpacity
                  onPress={() => toggleScheduleVisibility(item.serviceId)}>
                  <Text style={styles.viewScheduleText}>
                    {visibleSchedules[item.serviceId]
                      ? 'Hide Schedule'
                      : 'View Schedule'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {item.schedule.length > 0 && (
              <>
                {visibleSchedules[item.serviceId] &&
                  item.schedule.map(scheduleItem => (
                    <View key={scheduleItem.id} style={styles.scheduleItem}>
                      <Text style={styles.scheduleTitle}>
                        {scheduleItem.day}, {scheduleItem.month}{' '}
                        {scheduleItem.date}
                      </Text>
                      {scheduleItem.timeSlots.length > 0 ? (
                        scheduleItem.timeSlots.map(slot => (
                          <View key={slot.id} style={styles.scheduleTimeSlot}>
                            <Text style={styles.scheduleTime}>
                              {slot.time}
                            </Text>
                            <Text style={styles.availability}>
                              {slot.available ? 'Available' : 'Unavailable'}
                            </Text>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.scheduleTime}>
                          No time slots available
                        </Text>
                      )}
                    </View>
                  ))}
              </>
            )}
          </View>
        ))
      )}
    </View> */}

        <View style={styles.container}>
          {cartItems?.length === 0 ? (
            <Text style={styles.emptyText}>Your cart is empty!</Text>
          ) : (
            cartItems.map(item => {
              return (
                <CustomServiceCards
                  key={item.id}
                  item={item}
                  // deleteable={true}
                  handleRemoveService={handleRemoveService}
                  handleRemoveScheduledDate={handleRemoveScheduledDate}
                />
              );
            })
          )}
        </View>

        <TouchableOpacity style={styles.offersContainer}>
          <Text style={styles.couponsText}>Coupons and offers</Text>
          <Text style={styles.offerCount}>5 offers</Text>
        </TouchableOpacity>

        <View style={styles.paymentSummaryContainer}>
          <Text style={styles.sectionTitle}>Payment summary</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Item total</Text>
          </View>
        </View>

        {/* <CustomButton label={'Book service'} onPress={handlePress} /> */}
      </ScrollView>

      <CustomButton label={'Book service'} onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
