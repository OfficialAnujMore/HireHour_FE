import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {COLORS} from '../utils/globalConstants/color';
import {FontSize, Spacing} from '../utils/dimension';
import CustomText from './CustomText';

interface CustomTransactionCardProps {
  item: {
    id: string;
    userId: string;
    paymentId: string;
    transactionType: string;
    paymentStatus: string;
    totalAmount: string;
    tax: string;
    createdAt: string;
    updatedAt: string;
    transactionItems: {
      id: string;
      transactionId: string;
      serviceId: string;
      serviceTitle: string;
      servicePrice: string;
      serviceProviderId: string;
      venue: string;
      meetingUrl: string;
      address: string;
      city: string;
      postalCode: string;
      state: string;
      country: string;
      createdAt: string;
      updatedAt: string;
    }[];
  };
  handlePress: (id: string) => void;
}

const getTransactionIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    cash: 'money',
    paypal: 'paypal',
    card: 'credit-card',
  };
  return iconMap[type] || 'question-circle';
};

const getStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    confirmed: COLORS.success,
    pending: COLORS.warning,
    cancelled: COLORS.error,
  };
  return statusColors[status] || COLORS.gray;
};

const formatTransactionDateTime = (transactionDateTime: string) => {
  const dateObj = new Date(transactionDateTime);
  return {
    date: dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    time: dateObj.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  };
};

const CustomTransactionCard: React.FC<CustomTransactionCardProps> = ({
  item,
  handlePress,
}) => {


  const formatted = formatTransactionDateTime(item.createdAt);
  const transactionIcon = getTransactionIcon(item.transactionType);
  const statusColor = getStatusColor(item.paymentStatus);

  const getDisplayTitle = () => {
    if (!item.transactionItems || item.transactionItems.length === 0) {
      return '-';
    }
    const firstTitle = item.transactionItems[0].serviceTitle || 'Service';
    if (item.transactionItems.length > 1) {
      return `${firstTitle} +${item.transactionItems.length - 1}`;
    }
    return firstTitle;
  };

  return (
    <TouchableOpacity
      style={[styles.container, {borderLeftColor: statusColor}]}
      onPress={() => handlePress(item.serviceId)}
      activeOpacity={0.7}>
      <View style={styles.detailsContainer}>
        <Icon name={transactionIcon} size={24} color={COLORS.primary} />

        <View style={styles.orderDetails}>
          <View style={styles.row}>
            <CustomText style={styles.orderTitle} label={getDisplayTitle()} />
            <CustomText
              style={styles.orderTitle}
              label={`$${item.totalAmount}`}
            />
          </View>

          <View style={styles.row}>
            <CustomText style={styles.orderMeta} label="Transaction ID:" />
            <View
              style={[
                styles.statusContainer,
                {borderColor: statusColor, backgroundColor: statusColor + '1A'},
              ]}>
              <CustomText
                style={[styles.orderMeta, {color: statusColor}]}
                label={item.paymentStatus?.toUpperCase()}
              />
            </View>
          </View>

          <View style={styles.row}>
            <CustomText
              style={styles.orderMeta}
              label={item.paymentId || '---NA---'}
            />
          </View>

          <View style={styles.row}>
            <CustomText style={styles.orderMeta} label={formatted.date} />
            <CustomText style={styles.orderMeta} label={formatted.time} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: Spacing.small,
    marginVertical: Spacing.small,
    padding: Spacing.medium,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderLeftWidth: 5,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderDetails: {
    flex: 1,
    marginLeft: Spacing.medium,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  orderTitle: {
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  orderMeta: {
    fontSize: FontSize.small+2,
    color: COLORS.gray,
  },
  statusContainer: {
    borderRadius: 5,
    paddingHorizontal: Spacing.small - 6,
    borderWidth: 1,
  },
});

export default CustomTransactionCard;
