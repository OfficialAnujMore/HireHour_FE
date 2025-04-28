import {FallBack} from '../../components/FallBack';
import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {globalStyle} from '../../utils/globalStyle';
import {WORD_DIR} from '../../utils/local/en';
import noRecordFound from '../../assets/no-records.png';
import {useNavigation} from '@react-navigation/native';
import CustomTransactionCard from '../../components/CustomTransactionCard';
import {getTransactions} from '../../services/transactionService';
import {RootState} from 'redux/store';
import {useSelector} from 'react-redux';

export const TransactionHistory = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [transactionHistory, setTransactionHistory] = useState([]);

  const navigation = useNavigation();

  const handlePress = (serviceId: string) => {
    // Handle navigation or actions when a transaction is clicked
    // console.log('Transaction clicked:', serviceId);
  };

  const apiCall = async () => {
    const response = await getTransactions(user.id);   
    if (response.data) {
      setTransactionHistory(response.data);
    }
  };
  useEffect(() => {
    apiCall();
  }, []);

  return (
    <View style={globalStyle.globalContainer}>
      {transactionHistory.length === 0 ? (
        <FallBack
          heading={WORD_DIR.noTransaction}
          subHeading={WORD_DIR.noTransactionSubHeading}
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
