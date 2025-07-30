import React from 'react';
import {View, StyleSheet} from 'react-native';
import {globalStyle} from '../utils/globalStyle';
import CustomText from '../components/CustomText';
import {WORD_DIR} from '../utils/local/en';
import {FontSize, Spacing} from '../utils/dimension';
import {COLORS} from '../utils/globalConstants/color';

interface CustomPaymentSummaryProps {
  paymentDetails: {
    amount: number;
    tax: number;
    totalAmount: number;
    taxRate?: number;
  };
}

const CustomPaymentSummary: React.FC<CustomPaymentSummaryProps> = ({
  paymentDetails,
}) => {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <CustomText
          style={styles.summaryTitle}
          label={WORD_DIR.paymentSummary}
        />
        <CustomText
          style={styles.summarySubtitle}
          label="Review your payment details before proceeding"
          numberOfLines={4}
        />
      </View>

      {/* Payment Details Card */}
      <View style={styles.paymentCard}>
        {/* Amount Row */}
        <View style={styles.detailRow}>
          <View style={styles.labelContainer}>
            <CustomText style={styles.label} label={WORD_DIR.amount} />
            <CustomText
              style={styles.labelDescription}
              label="Base service cost"
            />
          </View>
          <CustomText
            style={styles.amount}
            label={`$${paymentDetails.amount.toFixed(2)}`}
          />
        </View>

        {/* Tax Row */}
        <View style={styles.detailRow}>
          <View style={styles.labelContainer}>
            <CustomText style={styles.label} label={WORD_DIR.tax} />
            <CustomText
              style={styles.labelDescription}
              label={`Service tax & fee (${paymentDetails.taxRate || 0}%)`}
            />
          </View>
          <CustomText
            style={styles.amount}
            label={`$${paymentDetails.tax.toFixed(2)}`}
          />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Total Row */}
        <View style={styles.totalRow}>
          <View style={styles.labelContainer}>
            <CustomText style={styles.totalLabel} label={WORD_DIR.total} />
            <CustomText
              style={styles.totalDescription}
              label="Amount to be charged"
            />
          </View>
          <CustomText
            style={styles.totalAmount}
            label={`$${paymentDetails.totalAmount.toFixed(2)}`}
          />
        </View>
      </View>

      {/* Important Details Section */}
      <View style={styles.importantDetailsSection}>
        <CustomText style={styles.importantTitle} label="Important Details" />
        <View style={styles.importantItem}>
          <CustomText
            style={styles.importantText}
            label="• Payment will be processed securely"
            numberOfLines={4}
          />
        </View>
        <View style={styles.importantItem}>
          <CustomText
            style={styles.importantText}
            label="• Your payment information is protected"
            numberOfLines={4}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerSection: {
    paddingVertical: Spacing.large,
    backgroundColor: COLORS.white,
  },
  summaryTitle: {
    fontSize: FontSize.large,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: Spacing.small,
  },
  summarySubtitle: {
    fontSize: FontSize.medium,
    color: COLORS.gray,
    lineHeight: 22,
  },
  paymentCard: {
    marginBottom: Spacing.small,
    borderRadius: 10,
    padding: Spacing.small,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.medium,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: FontSize.medium,
    color: COLORS.black,
    fontWeight: '500',
  },
  labelDescription: {
    fontSize: FontSize.small,
    color: COLORS.gray,
  },
  amount: {
    fontSize: FontSize.medium,
    color: COLORS.black,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: Spacing.small,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: FontSize.medium,
    color: COLORS.black,
    fontWeight: '600',
  },
  totalDescription: {
    fontSize: FontSize.small,
    color: COLORS.gray,
  },
  totalAmount: {
    fontSize: FontSize.medium + 2,
    fontWeight: '600',
    color: COLORS.primary,
  },
  importantDetailsSection: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: Spacing.medium,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  importantTitle: {
    fontSize: FontSize.medium,
    fontWeight: '600',
    color: COLORS.black,
  },
  importantItem: {
    marginBottom: Spacing.small,
  },
  importantText: {
    fontSize: FontSize.small,
    color: COLORS.gray,
    lineHeight: 18,
  },
});

export default CustomPaymentSummary;
