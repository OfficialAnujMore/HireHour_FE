import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { COLOR } from '../utils/globalConstants/color';
import { FontSize, Screen, Spacing } from '../utils/dimension';
import CustomText from './CustomText';
import { useNavigation } from '@react-navigation/native';

interface CustomCardsProps {
    onSearch: (query: string) => void; // Function to handle search logic
}
interface CardItem {
    id: string;
    title: string;
    description: string;
    location: string;
    status: string;
    offer: string | null;
    rating: number;
    time: string;
    distance: string;
    image: string;
};
const CustomCards: React.FC<{ item: CardItem }> = ({ item }) => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity style={styles.container} onPress={()=>{
            navigation.navigate("ServiceDetails", item)
        }}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.content}>
                <View style={styles.header}>
                    <CustomText label={item.title} style={styles.textStyle} />
                    <CustomText label={`⭐️  ${item.rating}`} style={[styles.ratings, styles.textStyle, styles.ratingStyle]} />
                </View>
                <CustomText label={item.description} style={styles.textStyle} />
                <CustomText label={item.location} style={styles.textStyle} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLOR.white,
        borderRadius: Spacing.small,
        marginVertical: Spacing.small,
        padding: Spacing.small,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    textStyle: {
        fontSize: FontSize.medium,
        fontWeight: '400',
    },
    ratingStyle: {
        fontSize: FontSize.small,
        color: COLOR.white
    },

    // title: {
    //     fontSize: FontSize.large,
    //     fontWeight: 'bold',
    //   },
    //   description: {
    //     fontSize: FontSize.medium,
    //     color: '#555',
    //   },
    //   location: {
    //     fontSize: FontSize.small,
    //     color: '#888',
    //     marginVertical: Spacing.small,
    //   },

    image: {

        width: Screen.width * 0.25,
        height: Screen.width * 0.25,
        borderRadius: Spacing.small,
    },
    content: {
        flex: 1,
        marginLeft: Spacing.medium,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor:"red"
    },
    ratings: {
        flexDirection: 'row',
        backgroundColor: 'green',
        justifyContent: 'center',
        borderRadius: Spacing.small,
        padding: Spacing.small / 2,
        // paddingHorizontal: Spacing.small
    }
});

export default CustomCards;
