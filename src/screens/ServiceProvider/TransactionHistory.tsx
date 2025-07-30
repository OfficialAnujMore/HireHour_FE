import {FallBack} from '../../components/FallBack';
import React, {useEffect, useState, useCallback} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {globalStyle} from '../../utils/globalStyle';
import {WORD_DIR} from '../../utils/local/en';
import noRecordFound from '../../assets/no-records.png';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'interfaces';
import CustomTransactionCard from '../../components/CustomTransactionCard';
import {getTransactions} from '../../services/transactionService';
import {RootState} from 'redux/store';
import {useSelector} from 'react-redux';
import {apiWithLoader} from '../../utils/apiWithLoader';
import {getErrorMessage} from '../../utils/errorHandler';

const TransactionHistory: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);

  const handlePress = (serviceId: string) => {
    // Handle navigation or actions when a transaction is clicked
    // console.log('Transaction clicked:', serviceId);
  };

  const apiCall = useCallback(async () => {
    if (!user?.id) {
      console.error('User ID not available');
      return;
    }
    
    const response = await apiWithLoader(
      () => getTransactions(user.id),
      'Loading transactions...'
    );   
    if (response.data) {
      setTransactionHistory(response.data);
    }
  }, [user?.id]);
  
  useEffect(() => {
    apiCall();
  }, [apiCall]);

  return (
    <View style={globalStyle.globalContainer}>
      {transactionHistory.length === 0 ? (
        <FallBack
          heading={WORD_DIR.noTransaction}
          subHeading={WORD_DIR.noTransactionSubHeading}
          imageSrc={noRecordFound}
          navigationRoute="Tabs"
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

export default TransactionHistory;
