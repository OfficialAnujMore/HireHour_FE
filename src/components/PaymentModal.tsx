import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';

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
        {/* Payment Summary Section */}
        <View style={styles.paymentSummary}>
          <Text style={styles.summaryTitle}>Payment Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Shipment Cost</Text>
            <Text style={styles.amount}>$55.54</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Insurance</Text>
            <Text style={styles.amount}>$1.00</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total Payment</Text>
            <Text style={styles.totalAmount}>$56.54</Text>
          </View>
        </View>

        {/* Payment Methods Section */}
        <Text style={styles.title}>Choose Payment Method</Text>
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
              color="#555"
              style={styles.icon}
            />
            <Text style={styles.optionText}>{option.label}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.securityNote}>
          All transactions are secure and encrypted.
        </Text>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => selectedPayment && onPaymentSelect(selectedPayment)}
          disabled={!selectedPayment}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {justifyContent: 'flex-end', margin: 0},
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  paymentSummary: {marginBottom: 20},
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

  title: {fontSize: 18, fontWeight: 'bold', marginBottom: 15},
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
  },
  selectedOption: {backgroundColor: '#e0f7fa'},
  icon: {marginRight: 10},
  optionText: {fontSize: 16},
  securityNote: {
    fontSize: 12,
    color: 'gray',
    marginTop: 15,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  continueButtonText: {color: 'white', fontSize: 16, fontWeight: 'bold'},
});

export default PaymentModal;
