import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {Screen, Spacing, FontSize} from '../../utils/dimension';
import CustomButton from '../../components/CustomButton';
import {bookService} from '../../services/serviceProviderService';
import {showSnackbar} from '../../redux/snackbarSlice';
import {clearCart} from '../../redux/cartSlice';

const SummaryScreen: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [visibleSchedules, setVisibleSchedules] = useState<
    Record<string, boolean>
  >({});

  const toggleScheduleVisibility = (serviceId: string) => {
    setVisibleSchedules(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };
  const handlePress = async () => {
    const timeSlotIds = cartItems.flatMap(service =>
      service.schedule.flatMap(schedule =>
        schedule.timeSlots.map(slot => slot.id),
      ),
    );

    console.log(timeSlotIds);

    const response = await bookService({
      userId: user?.id,
      timeSlotIds: timeSlotIds,
    });

    if (response.success) {
      dispatch(showSnackbar(response.message));
      dispatch(clearCart());
    }
    console.log(response);
  };
  console.log(cartItems);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Your orders</Text>
      <View style={styles.orderContainer}>
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
      </View>

      <TouchableOpacity style={styles.offersContainer}>
        <Text style={styles.couponsText}>Coupons and offers</Text>
        <Text style={styles.offerCount}>5 offers</Text>
      </TouchableOpacity>

      <View style={styles.paymentSummaryContainer}>
        <Text style={styles.sectionTitle}>Payment summary</Text>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Item total</Text>
          <Text style={styles.paymentValue}>
            ${' '}
            {cartItems.reduce(
              (total, item) =>
                total +
                Number(item.chargesPerHour) *
                  item.schedule.reduce(
                    (scheduleTotal, schedule) =>
                      scheduleTotal + (schedule.timeSlots.length || 0), // Add the number of time slots in each schedule
                    0,
                  ),
              0,
            )}
          </Text>
        </View>
      </View>

      <CustomButton label={'Add to cart'} onPress={handlePress} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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

export default SummaryScreen;
