import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { COLORS } from '../utils/globalConstants/color';
import { FontSize, Screen, Spacing } from '../utils/dimension';
import CustomText from './CustomText';
import { useNavigation } from '@react-navigation/native';
import { CustomRatingInfo } from './CustomRatingInfo';

interface CustomCardsProps {
    onSearch: (query: string) => void; // Function to handle search logic
}
interface CardItem {
    id: string;               // Service ID
    title: string;            // Service title
    description: string;      // Service description
    location: string;         // Assuming location data might come from `phoneNumber` or another field
    status: string;           // Can be "Active", "Inactive", etc. (could come from `isDeleted` or `isDisabled`)
    offer: string | null;     // Assuming this could be any offers available, null if none
    rating: number;           // Assuming you might want to include a rating (currently not in the data)
    time: string;             // The time of the service or availability (could be derived from `schedule`)
    distance: string;         // Could be computed or stored elsewhere (currently not in the data)
    image: string;            // Could come from `servicePreview`
}
const CustomCards: React.FC<{ item: any }> = ({ item }) => {
    const navigation = useNavigation()
    return (
        <TouchableOpacity style={styles.container} onPress={() => {
            navigation.navigate("ServiceDetails", item)
        }}>
            <Image source={{ uri: item.profileImageURL??'' }} style={styles.image} />
            <View style={styles.content}>
                <View style={styles.header}>
                    <CustomText label={item.title} style={styles.textStyle} />
                    <CustomRatingInfo rating={'4.5'} />
                </View>
                <CustomText label={item.description} style={styles.textStyle} />
                <CustomText label={item.category} style={styles.textStyle} />
                <CustomText label={item.chargesPerHour} style={styles.textStyle} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
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
        color: COLORS.white
    },

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
    },
    ratings: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingsContainer: {
        backgroundColor: "green",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Spacing.small,
        padding: Spacing.small / 2,
    }
});

export default CustomCards;
