import {FallBack} from '../../components/FallBack';
import React, {useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {globalStyle} from '../../utils/globalStyle';
import {WORD_DIR} from '../../utils/local/en.js';
import noRecordFound from '../../assets/no-records.png';
import {useNavigation} from '@react-navigation/native';
import CustomTransactionCard from '../../components/CustomTransactionCard';

export const TransactionHistory = () => {
  const [transactionHistory, setTransactionHistory] = useState([
    {
      userId: '1df1aaba-153a-4e70-9e01-0e831ae3fd26',
      serviceId: '4bbc181c-1d0f-40a4-a50a-a56ec2521e59',
      title: 'Dog Service',
      description: 'We provide dog service',
      totalAmt: '180.00',
      transactionType: 'cash',
      status: 'confirmed',
      transactionId: '121223434787823',
      transactionDateTime: '2025-02-10 00:28:36.635',
    },
    {
      userId: '1df1aaba-153a-4e70-9e01-0e831ae3fd26',
      serviceId: 'f8539bd6-11c7-4ee4-a6a7-9eb7342cc50b',
      title: 'Flower Service',
      description: 'We provide flower service',
      totalAmt: '180.00',
      transactionType: 'card',
      status: 'pending',
      transactionId: '121223434787824',
      transactionDateTime: '2025-02-10 00:28:36.635',
    },
    {
      userId: '1df1aaba-153a-4e70-9e01-0e831ae3fd26',
      serviceId: 'a1239bd6-22c7-4ee4-b6a7-9eb7342cc50c',
      title: 'Flower Service',
      description: 'We provide flower service',
      totalAmt: '180.00',
      transactionType: 'paypal',
      status: 'cancelled',
      transactionId: '121223434787825',
      transactionDateTime: '2025-02-10 00:28:36.635',
    },
  ]);

  const navigation = useNavigation();

  const handlePress = (serviceId: string) => {
    // Handle navigation or actions when a transaction is clicked
    console.log('Transaction clicked:', serviceId);
  };

  return (
    <View style={globalStyle.globalContainer}>
      {transactionHistory.length === 0 ? (
        <FallBack
          heading={WORD_DIR.emptyCartHeading}
          subHeading={WORD_DIR.emptyCartSubHeading}
          imageSrc={noRecordFound}
        />
      ) : (
        <FlatList
          data={transactionHistory}
          keyExtractor={item => `${item.serviceId}-${item.transactionId}`}
          renderItem={({item}) => (
            <CustomTransactionCard item={item} handlePress={handlePress} />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: 0},
});
