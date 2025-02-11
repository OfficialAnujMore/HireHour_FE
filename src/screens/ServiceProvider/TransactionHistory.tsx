import {FallBack} from '../../components/FallBack';
import React, {useState} from 'react';
import {View, Text, Button, Alert, StyleSheet, ScrollView} from 'react-native';
import {globalStyle} from '../../utils/globalStyle';
import {WORD_DIR} from '../../utils/local/en';
import noRecordFound from '../../assets/no-records.png';

export const TransactionHistory = ({}) => {
  const [transactionHistory, setTransactionHistory] = useState([]);
  return (
    <View style={globalStyle.globalContainer}>
      {transactionHistory?.length === 0 ? (
        <FallBack
          heading={WORD_DIR.emptyCartHeading}
          subHeading={WORD_DIR.emptyCartSubHeading}
          imageSrc={noRecordFound}
          buttonLabel={WORD_DIR.goHome}
          navigationRoute="Home"
        />
      ) : (
        <ScrollView>
          <View style={styles.container}></View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: 0},
});
