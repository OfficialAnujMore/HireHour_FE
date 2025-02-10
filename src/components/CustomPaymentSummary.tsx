import React from 'react';
import {View, Text,StyleSheet} from 'react-native';
import {Spacing} from '../utils/dimension';
import {COLORS} from '../utils/globalConstants/color';
import { globalStyle } from '../utils/globalStyle';

interface PaymentModalProps {
  amount: string;
  tax: string;
  totalAmount: string;
}

const CustomPaymentSummary: React.FC<PaymentModalProps> = ({
  amount,
  tax,
  totalAmount,
}) => {
  return (
    <View style={globalStyle.sectionContainer}>
      <Text style={styles.summaryTitle}>Payment Summary</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Amount</Text>
        <Text style={styles.amount}>${amount}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Tax @20</Text>
        <Text style={styles.amount}>${tax}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total Payment</Text>
        <Text style={styles.totalAmount}>${totalAmount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryTitle: {fontSize: 16, fontWeight: 'bold', marginBottom: 10},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  label: {fontSize: 14, color: '#777'},
  amount: {fontSize: 14, color: '#333'},
  divider: {height: 1, backgroundColor: '#ddd', marginVertical: 10},
  totalLabel: {fontSize: 16, fontWeight: 'bold'},
  totalAmount: {fontSize: 16, fontWeight: 'bold', color: '#000'},
});

export default CustomPaymentSummary;
