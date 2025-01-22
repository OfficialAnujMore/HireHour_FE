import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image, Alert, FlatList } from "react-native";
import { FontSize, Spacing } from "../../utils/dimension";
import CustomText from "../../components/CustomText";
import { RootState } from "redux/store";
import { useSelector } from "react-redux";
import { getUserServices } from "../../services/userService";
import CustomCards from "../../components/CustomCards";
import { useNavigation } from '@react-navigation/native';

const MyServices = () => {
    // const { serviceId } = route.params;
    const [serviceDetails, setServiceDetails] = useState(null);
  const navigation = useNavigation();
    const user = useSelector((state: RootState) => state.auth.user);
    useEffect(() => {
        const fetchService = async () => {
            try {
                const service = await getUserServices({
                    id: user?.id
                }); // Function to fetch service details
                console.log('Serviuce details fetched', service.data);

                setServiceDetails(service.data);
            } catch (error) {
                console.log(error);

                Alert.alert("Error", "Failed to fetch service details.");
            }
        };

        fetchService();
    }, []);

    if (!serviceDetails) return null;

    return (
        <View>
            <FlatList
                data={serviceDetails}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <CustomCards item={item}
                 handlePress={() => {
                    navigation.navigate("ViewService", item)
                }} />}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.medium,
        backgroundColor: "#fff",
    },
    heading: {
        fontSize: FontSize.large,
        fontWeight: "bold",
        marginBottom: Spacing.small,
    },
    text: {
        fontSize: FontSize.medium,
        marginBottom: Spacing.small,
    },
    subHeading: {
        fontSize: FontSize.medium,
        fontWeight: "bold",
        marginTop: Spacing.medium,
    },
    imageContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: Spacing.medium,
    },
    image: {
        width: 100,
        height: 100,
        margin: 5,
    },
    scheduleItem: {
        marginBottom: Spacing.small,
    },
});

export default MyServices;
