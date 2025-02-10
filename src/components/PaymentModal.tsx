import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomPaymentSummary from '../components/CustomPaymentSummary';
import CustomButton from './CustomButton';
import {WORD_DIR} from '../utils/local/en';
import {FontSize, Spacing} from '../utils/dimension';
import {COLORS} from '../utils/globalConstants/color';
import CustomText from '../components/CustomText';

interface PaymentModalProps {
  isVisible: boolean;
  onClose: () => void;
  onPaymentSelect: (method: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isVisible,
  onClose,
  onPaymentSelect,
}) => {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const paymentOptions = [
    {id: 'cash', label: 'Record a Cash Payment', icon: 'money'},
    {id: 'debit_card', label: 'Debit Card', icon: 'credit-card'},
    {id: 'paypal', label: 'PayPal', icon: 'paypal'},
  ];

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown">
      <View style={styles.container}>
        <CustomPaymentSummary amount={'10'} tax={'0.2'} totalAmount={'12.0'} />

        {/* Payment Methods Section */}
        <CustomText style={styles.title} label={WORD_DIR.choosePayment} />
        {paymentOptions.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionContainer,
              selectedPayment === option.id && styles.selectedOption,
            ]}
            onPress={() => setSelectedPayment(option.id)}>
            <Icon
              name={option.icon}
              size={24}
              color={COLORS.primary}
              style={styles.icon}
            />
            <CustomText style={styles.optionText} label={option.label} />
          </TouchableOpacity>
        ))}
        <CustomText
          style={styles.securityNote}
          label={WORD_DIR.secureTransaction}
        />

        <CustomButton
          onPress={() => selectedPayment && onPaymentSelect(selectedPayment)}
          disabled={!selectedPayment}
          label={WORD_DIR.continue}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {justifyContent: 'flex-end', margin: 0},
  container: {
    backgroundColor: COLORS.white,
    padding: Spacing.medium,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  title: {
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    marginBottom: Spacing.medium,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.medium,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    marginBottom: Spacing.medium,
    borderBottomWidth: 1,
  },
  selectedOption: {borderColor: COLORS.primary, borderWidth: 1},
  icon: {marginRight: Spacing.small},
  optionText: {fontSize: FontSize.small},
  securityNote: {
    fontSize: FontSize.small,
    color: COLORS.black,
  },
});

export default PaymentModal;
