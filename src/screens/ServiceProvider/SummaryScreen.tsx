import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Screen, Spacing, FontSize } from '../../utils/dimension';

const SummaryScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Plus Banner */}
      <View style={styles.plusContainer}>
        <Text style={styles.plusText}>
          <Text style={styles.plusIcon}>⭐ </Text>
          Save 15% on every service
        </Text>
        <TouchableOpacity>
          <Text style={styles.selectPlan}>Select your plan</Text>
        </TouchableOpacity>
      </View>

      {/* Orders */}
      <Text style={styles.sectionTitle}>Your orders</Text>
      <View style={styles.orderContainer}>
        {/* Order Item 1 */}
        <View style={styles.orderItem}>
          <Image
            source={{ uri: 'https://via.placeholder.com/60' }} // Replace with real image URL
            style={styles.orderImage}
          />
          <View style={styles.orderDetails}>
            <Text style={styles.orderTitle}>Fruits Cleanup</Text>
            <Text style={styles.orderMeta}>⭐ 4.76 (978k) | 55 mins</Text>
            <TouchableOpacity>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.orderPriceContainer}>
            <Text style={styles.price}>₹ 500</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity style={styles.counterButton}>
                <Text style={styles.counterText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.counterText}>1</Text>
              <TouchableOpacity style={styles.counterButton}>
                <Text style={styles.counterText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Order Item 2 */}
        <View style={styles.orderItem}>
          <Image
            source={{ uri: 'https://via.placeholder.com/60' }} // Replace with real image URL
            style={styles.orderImage}
          />
          <View style={styles.orderDetails}>
            <Text style={styles.orderTitle}>Manvi's Package</Text>
            <Text style={styles.orderMeta}>⭐ 4.76 (978k) | 90 mins</Text>
            <TouchableOpacity>
              <Text style={styles.customizeText}>Customize</Text>
            </TouchableOpacity>
            <Text style={styles.packageDetails}>• Full body massage - ₹ 200</Text>
            <Text style={styles.packageDetails}>• Head massage - ₹ 100</Text>
            <Text style={styles.packageDetails}>• Manicure - ₹ 200</Text>
            <Text style={styles.packageDetails}>• Pedicure - ₹ 300</Text>
          </View>
          <View style={styles.orderPriceContainer}>
            <Text style={styles.strikeThrough}>₹ 960</Text>
            <Text style={styles.price}>₹ 800</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity style={styles.counterButton}>
                <Text style={styles.counterText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.counterText}>1</Text>
              <TouchableOpacity style={styles.counterButton}>
                <Text style={styles.counterText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Coupons and Offers */}
      <TouchableOpacity style={styles.offersContainer}>
        <Text style={styles.couponsText}>Coupons and offers</Text>
        <Text style={styles.offerCount}>5 offers</Text>
      </TouchableOpacity>

      {/* Payment Summary */}
      <View style={styles.paymentSummaryContainer}>
        <Text style={styles.sectionTitle}>Payment summary</Text>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Item total</Text>
          <Text style={styles.paymentValue}>₹ 1,394</Text>
        </View>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Item discount</Text>
          <Text style={styles.paymentValue}>-₹ 120</Text>
        </View>
      </View>

      {/* Address and Date */}
      <View style={styles.addressContainer}>
        <Text style={styles.addressText}>Home - D 105, Kesnand Rd, opp. t...</Text>
        <TouchableOpacity>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>Sun, Jul 17 - 07:00 AM</Text>
        <TouchableOpacity>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Pay Button */}
      <TouchableOpacity style={styles.payButton}>
        <Text style={styles.payButtonText}>Pay ₹ 1,323</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  plusContainer: {
    backgroundColor: '#EDE7F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.medium,
  },
  plusText: {
    fontSize: FontSize.medium,
    color: '#5E35B1',
  },
  plusIcon: {
    fontWeight: 'bold',
  },
  selectPlan: {
    fontSize: FontSize.medium,
    color: '#303F9F',
    fontWeight: 'bold',
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
  customizeText: {
    fontSize: FontSize.small,
    color: '#03A9F4',
    marginTop: Spacing.small,
  },
  packageDetails: {
    fontSize: FontSize.small,
    color: '#333',
  },
  orderPriceContainer: {
    alignItems: 'flex-end',
  },
  strikeThrough: {
    fontSize: FontSize.small,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    color: '#333',
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
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.medium,
    backgroundColor: '#F5F5F5',
    marginTop: Spacing.medium,
  },
  addressText: {
    fontSize: FontSize.medium,
    color: '#333',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.medium,
    backgroundColor: '#F5F5F5',
    marginTop: Spacing.medium,
  },
  dateText: {
    fontSize: FontSize.medium,
    color: '#333',
  },
  payButton: {
    backgroundColor: '#03A9F4',
    padding: Spacing.medium,
    margin: Spacing.medium,
    borderRadius: Screen.moderateScale(8),
  },
  payButtonText: {
    fontSize: FontSize.large,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default SummaryScreen;