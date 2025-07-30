import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomPaymentSummary from '../components/CustomPaymentSummary';
import CustomButton from './CustomButton';
import {WORD_DIR} from '../utils/local/en';
import {FontSize, Spacing} from '../utils/dimension';
import {COLORS} from '../utils/globalConstants/color';
import CustomText from '../components/CustomText';
import uuid from 'react-native-uuid';

interface PaymentModalProps {
  paymentDetails: {
    amount: number;
    tax: number;
    totalAmount: number;
    taxRate?: number;
  };
  isVisible: boolean;
  onClose: () => void;
  onPaymentSelect: (paymentData: {
    transactionType: string;
    paymentId: string;
  }) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  paymentDetails,
  isVisible,
  onClose,
  onPaymentSelect,
}) => {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const paymentOptions = [
    {
      id: 'cash',
      label: 'Cash Payment',
      description: 'Record a cash transaction',
      icon: 'money',
      color: COLORS.success,
      disabled: false,
    },
    {
      id: 'card',
      label: 'Debit/Credit Card',
      description: 'Secure card payment (Coming Soon)',
      icon: 'credit-card',
      color: COLORS.gray,
      disabled: true,
    },
    {
      id: 'paypal',
      label: 'PayPal',
      description: 'Pay with PayPal account (Coming Soon)',
      icon: 'paypal',
      color: COLORS.gray,
      disabled: true,
    },
  ];
  const [paymentId, setPaymentId] = useState('');

  useEffect(() => {
    if (selectedPayment === paymentOptions[0].id) {
      setPaymentId(uuid.v4());
    }
  }, [selectedPayment]);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <CustomText style={styles.modalTitle} label="Complete Payment" />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="times" size={24} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Payment Summary */}
          <CustomPaymentSummary paymentDetails={paymentDetails} />

          {/* Payment Methods Section */}
          <View style={styles.paymentMethodsSection}>
            <CustomText
              style={styles.sectionTitle}
              label={WORD_DIR.choosePayment}
            />
            <CustomText
              style={styles.sectionSubtitle}
              label="Select your preferred payment method"
            />

            <View style={styles.paymentOptionsContainer}>
              {paymentOptions.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.paymentOption,
                    selectedPayment === option.id &&
                      styles.selectedPaymentOption,
                    option.disabled && styles.disabledPaymentOption,
                  ]}
                  onPress={() => !option.disabled && setSelectedPayment(option.id)}
                  disabled={option.disabled}>
                  <View style={styles.optionContent}>
                    <View
                      style={[
                        styles.iconContainer,
                        {backgroundColor: option.color + '20'},
                      ]}>
                      <Icon name={option.icon} size={24} color={option.color} />
                    </View>
                    <View style={styles.optionDetails}>
                      <CustomText
                        style={styles.optionLabel}
                        label={option.label}
                      />
                      <CustomText
                        style={styles.optionDescription}
                        label={option.description}
                      />
                    </View>
                  </View>
                  {selectedPayment === option.id && (
                    <View style={styles.selectedIndicator}>
                      <Icon
                        name="check-circle"
                        size={20}
                        color={COLORS.success}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Security Note */}
            <View style={styles.securitySection}>
              <View style={styles.securityHeader}>
                <Icon name="shield" size={16} color={COLORS.success} />
                <CustomText
                  style={styles.securityTitle}
                  label="Secure Transaction"
                />
              </View>
              <CustomText
                style={styles.securityNote}
                label={WORD_DIR.secureTransaction}
              />
            </View>
          </View>
        </ScrollView>

        {/* Action Button */}
        <View style={styles.actionSection}>
          <CustomButton
            onPress={() => {
              if (selectedPayment) {
                onPaymentSelect({
                  transactionType: selectedPayment,
                  paymentId: paymentId,
                });
              }
            }}
            disabled={!selectedPayment}
            label={WORD_DIR.continue}
            style={styles.continueButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  modalTitle: {
    fontSize: FontSize.large,
    fontWeight: '600',
    color: COLORS.black,
  },
  closeButton: {
    padding: Spacing.small,
  },
  scrollContent: {
    paddingHorizontal: Spacing.large,
  },
  paymentMethodsSection: {
    // marginTop: Spacing.large,
    marginBottom: Spacing.small,
  },
  sectionTitle: {
    fontSize: FontSize.large,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: Spacing.small,
  },
  sectionSubtitle: {
    fontSize: FontSize.small,
    color: COLORS.gray,
    marginBottom: Spacing.large,
  },
  paymentOptionsContainer: {
    marginBottom: Spacing.large,
  },
  paymentOption: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: Spacing.medium,
    marginBottom: Spacing.medium,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedPaymentOption: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: COLORS.primary + '05',
  },
  disabledPaymentOption: {
    opacity: 0.5,
    backgroundColor: COLORS.lightGray + '20',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.medium,
  },
  optionDetails: {
    flex: 1,
  },
  optionLabel: {
    fontSize: FontSize.medium,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: FontSize.small,
    color: COLORS.gray,
  },
  selectedIndicator: {
    marginLeft: Spacing.small,
  },
  securitySection: {
    backgroundColor: COLORS.success + '10',
    borderRadius: 12,
    padding: Spacing.medium,
    borderWidth: 1,
    borderColor: COLORS.success + '20',
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.small,
  },
  securityTitle: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: COLORS.success,
    marginLeft: Spacing.small,
  },
  securityNote: {
    fontSize: FontSize.small,
    color: COLORS.gray,
    lineHeight: 18,
  },
  actionSection: {
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  continueButton: {
    borderRadius: 12,
  },
});

export default PaymentModal;
