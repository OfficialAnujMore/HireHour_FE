import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import {Screen, Spacing, FontSize} from '../../utils/dimension';

const SummaryScreen: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  console.log(cartItems);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Your orders</Text>
      <View style={styles.orderContainer}>
        {cartItems.length === 0 ? (
          <Text style={styles.noItemsText}>No items in your cart</Text>
        ) : (
          cartItems.map((item, index) => (
            <View key={item.serviceId} style={styles.orderItem}>
              <Image
                source={{
                  uri: item.avatarUri || 'https://via.placeholder.com/60',
                }}
                style={styles.orderImage}
              />
              <View style={styles.orderDetails}>
                <Text style={styles.orderTitle}>{item.title}</Text>
                <Text style={styles.orderMeta}>
                  {item.ratings} ★ | ${item.chargesPerHour}/hr
                </Text>
                <Text style={styles.orderMeta}>{item.description}</Text>
                <TouchableOpacity>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.orderPriceContainer}>
                <Text style={styles.price}>$ {item.chargesPerHour}</Text>
                <View style={styles.counterContainer}>
                  <TouchableOpacity style={styles.counterButton}>
                    <Text style={styles.counterText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.counterText}>{item.quantity || 1}</Text>
                  <TouchableOpacity style={styles.counterButton}>
                    <Text style={styles.counterText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
                total + Number(item.chargesPerHour) * (item.quantity || 1),
              0,
            )}
          </Text>
        </View>
      </View>
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
    paddingHorizontal: Spacing.medium,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  orderDetails: {
    flex: 1,
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
  editText: {
    fontSize: FontSize.small,
    color: '#03A9F4',
    fontWeight: 'bold',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.small,
  },
  counterButton: {
    backgroundColor: '#EEEEEE',
    width: Screen.moderateScale(30),
    height: Screen.moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Screen.moderateScale(5),
  },
  counterText: {
    fontSize: FontSize.medium,
    color: '#333',
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
  noItemsText: {
    fontSize: FontSize.medium,
    color: '#333',
    textAlign: 'center',
    marginTop: Spacing.medium,
  },
});

export default SummaryScreen;
