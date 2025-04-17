import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {globalStyle} from '../utils/globalStyle';
import CustomText from '../components/CustomText';
import {WORD_DIR} from '../utils/local/en';
import {FontSize, Spacing} from '../utils/dimension';
import {COLORS} from '../utils/globalConstants/color';

interface PaymentModalProps {
  amount: Number;
}

const CustomPaymentSummary: React.FC<PaymentModalProps> = ({amount}) => {
  const [paymentDetails, setPaymentDetails] = useState({
    amount: 0.0,
    tax: 0.0,
    totalAmount: 0.0,
  });
  const calculateTotalAmount = (amount: number, taxRate: number) => {
    const tax = amount * (taxRate / 100);
    const totalAmount = amount + tax;

    setPaymentDetails(prevDetails => ({
      ...prevDetails,
      amount,
      tax,
      totalAmount,
    }));
  };
  useEffect(() => {
    calculateTotalAmount(Number(amount), 20);
  }, [amount]);

  return (
    <View style={globalStyle.sectionContainer}>
      <CustomText style={styles.summaryTitle} label={WORD_DIR.paymentSummary} />

      <View style={styles.row}>
        <CustomText style={styles.label} label={WORD_DIR.amount} />
        <CustomText
          style={styles.amount}
          label={`$ ${paymentDetails.amount}`}
        />
      </View>
      <View style={styles.row}>
        <CustomText style={styles.label} label={WORD_DIR.tax} />
        <CustomText style={styles.amount} label={`$ ${paymentDetails.tax}`} />
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <CustomText style={styles.total} label={WORD_DIR.total} />
        <CustomText
          style={styles.total}
          label={`$ ${paymentDetails.totalAmount}`}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryTitle: {
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    marginBottom: Spacing.small,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: FontSize.small + 2,
    color: COLORS.black,
    fontWeight: 'bold',
  },

  amount: {fontSize: FontSize.small + 2, color: COLORS.black},
  divider: {height: 1, backgroundColor: COLORS.black, marginVertical: 10},
  total: {fontSize: FontSize.small + 2, fontWeight: 'bold', color: '#000'},
});

export default CustomPaymentSummary;
