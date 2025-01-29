
import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import CustomText from '../components/CustomText';
import { getUpcomingEvents } from '../services/userService';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import CustomEventCard from '../components/CustomEventCard';
import { useFocusEffect } from '@react-navigation/native';
const UpcomingEvents = ({ }) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [data, setData] = useState();

    const apiCall = async () => {
        const response = await getUpcomingEvents({ userId: user?.id })
        setData(response?.data)

    }
     useFocusEffect(
        useCallback(() => {
            apiCall();
        }, [])
      );
    return (
        <View style={styles.container}>
            {
                data ?
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <CustomEventCard item={item} handlePress={() => {
                            // navigation.navigate("ServiceDetails", item)
                        }} />}
                        showsVerticalScrollIndicator={false}
                    />
                    :
                    <CustomText label={"No upcoming events"} />

            }


        </View>

    )
}

const styles = StyleSheet.create({
    container: { padding: 0 }
})
export default UpcomingEvents