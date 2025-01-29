import React, { useEffect, useState } from "react";
import {
    View,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Alert,
    ScrollView,
} from "react-native";
import moment from "moment";
import { FontSize, Spacing } from "../../utils/dimension";
import CustomText from "../../components/CustomText";
import CustomInput from "../../components/CustomInput";
import { WORD_DIR } from "../../utils/local/en";
import { COLORS } from "../../utils/globalConstants/color";
import CustomButton from "../../components/CustomButton";
import { RootState } from "redux/store";
import { useSelector } from "react-redux";
import { addService } from "../../services/userService";
import CustomDropdown from "../../components/CustomDropdown";
import { CATEGORY } from "../../utils/constants";

interface TimeSlot {
    id: string;
    time: string;
    available: boolean;
}

interface DateInfo {
    id: string;
    day: string;
    date: string;
    month: string;
    fullDate: string;
    timeSlots: TimeSlot[];
}

const generateDates = (): DateInfo[] => {
    const timeSlots: TimeSlot[] = Array.from({ length: 24 }, (_, i) => ({
        id: `${i + 1}`,
        time: moment().startOf("day").add(i, "hours").format("hh:00 A"),
        available: false,
    }));

    return Array.from({ length: 10 }, (_, i) => {
        const date = moment().add(i, "days");
        return {
            id: `${i}`,
            day: date.format("ddd"),
            date: date.format("DD"),
            month: date.format("MMM"),
            fullDate: date.toISOString(),
            timeSlots: [...timeSlots],
        };
    });
};

const CreateServiceScreen = () => {
    const [dates, setDates] = useState<DateInfo[]>([]);
    const [selectedDateId, setSelectedDateId] = useState<string | null>(null);
    const [serviceDetails, setServiceDetails] = useState({
        title: "",
        description: "",
        chargesPerHour: "",
        category: CATEGORY[Object.keys(CATEGORY)[0] as keyof typeof CATEGORY]
    });

    const user = useSelector((state: RootState) => state.auth.user);

    // Initialize dates only once
    useEffect(() => {
        setDates(generateDates());
    }, []);



    const selectedDate = dates.find((date) => date.id === selectedDateId);

    const handleServiceCreation = async () => {
        if (!serviceDetails.title || !serviceDetails.description || !serviceDetails.chargesPerHour) {

            Alert.alert("Error", "Please fill in all service details.");
            return;
        }
        if (!selectedDate || selectedDate.timeSlots.every((slot) => slot.available)) {
            Alert.alert("Error", "Please select a date and at least one available time slot.");
            return;
        }

        const selectedSlots = selectedDate.timeSlots.filter((slot) => slot.available);
        const finalSchedule = dates.map((item) => {

            const filteredTimeSlots = item.timeSlots.filter((slot) => slot.available);

            return {
                id: item.id,
                day: item.day,
                date: item.date,
                month: item.month,
                fullDate: item.fullDate,
                timeSlots: filteredTimeSlots,
            };
        }).filter((item) => item.timeSlots.length > 0); // Filter out dates with no available slots





        try {
            // Prepare the data for the API call
            const data = {
                id: user?.id, // Replace with the actual user ID
                userRole: user?.userRole,
                serviceData: {
                    title: serviceDetails.title,
                    description: serviceDetails.description,
                    chargesPerHour: serviceDetails.chargesPerHour,
                    userId: user?.id,
                    category: serviceDetails.category,
                    servicePreview: [
                        {
                            imageUri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWMrZ357DGddYlOKJJpLwZ6nPsEJdH3RYFOWGoX00-6UumyVwUYQNAZBEBlU23tngDdqU&usqp=CAU"
                        },
                        {
                            imageUri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDQjNpHNzb6bZBzjYnv65_tjUwn-fdIvs_-eWmjzHcAftNsBXdaOLb-9Mb8SsmQK9WRb0&usqp=CAU"
                        },
                        {
                            imageUri: "https://static.vecteezy.com/system/resources/thumbnails/030/633/119/small_2x/an-artistic-composition-featuring-an-acoustic-guitar-amidst-nature-with-space-for-text-with-a-textured-background-of-leaves-or-tree-bark-ai-generated-photo.jpg"
                        }
                    ],
                    schedule: finalSchedule.map((item) => {
                        return {
                            day: item.day,
                            month: item.month,
                            date: item.date,
                            fullDate: item.fullDate,
                            timeSlots: item.timeSlots.map((slot) => ({
                                id: slot.id,
                                time: slot.time,
                                available: slot.available
                            }))
                        };
                    })
                }
            };
            const response = await addService(data); // Assuming the addService function is available

            Alert.alert("Success", `Service created on ${selectedDate.day}, ${selectedDate.date} at ${selectedSlots.map(slot => slot.time).join(", ")}.`);
        } catch (error) {
            Alert.alert("Error", "There was an issue creating the service.");
        }
    };


    const isPastTime = (date: DateInfo, time: string): boolean => {
        const currentDateTime = moment();
        const slotDateTime = moment(
            `${date.date}-${date.month}-${moment().year()} ${time}`,
            "DD-MMM-YYYY hh:mm A"
        );
        return currentDateTime.isAfter(slotDateTime);
    };

    const handleDateSelect = (id: string) => {
        setSelectedDateId(id);
    };

    const toggleTimeSlot = (timeSlot: TimeSlot) => {
        if (!selectedDate) return;
        setDates((prevDates) =>
            prevDates.map((date) =>
                date.id === selectedDate.id
                    ? {
                        ...date,
                        timeSlots: date.timeSlots.map((slot) =>
                            slot.id === timeSlot.id
                                ? { ...slot, available: !slot.available }
                                : slot
                        ),
                    }
                    : date
            )
        );
    };

    // const handleValueChange = (field: keyof typeof user, value: string) => {
    //     // console.log(field,value);
    //     setServiceDetails((prev) => ({ ...prev, [field]: value }))
    //     setUser((prevState) => ({ ...prevState, [field]: value }));
    //     validateField(field, value);
    // };
    const renderInput = (
        label: string,
        value: string,
        placeholder: string,
        field: keyof typeof serviceDetails,
        keyboardType?: 'default' | 'email-address' | 'phone-pad',
        secureTextEntry?: boolean
    ) => (
        <CustomInput
            label={label}
            value={value}
            placeholder={placeholder}
            onValueChange={(value) => setServiceDetails((prev) => ({ ...prev, [field]: value }))
            }
            // handleValueChange(field, value)}
            // errorMessage={errors[field]}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
        />
    );

    return (
        <ScrollView style={styles.container}>
            <CustomText label={WORD_DIR.serviceDetails} style={styles.heading} />
            {renderInput(WORD_DIR.title, serviceDetails.title, WORD_DIR.title, 'title')}
            {renderInput(WORD_DIR.description, serviceDetails.description, WORD_DIR.description, 'description')}
            {renderInput(WORD_DIR.chargesPerHour, serviceDetails.chargesPerHour, WORD_DIR.chargesPerHour, 'chargesPerHour')}
            {/* <CustomDropdown
                label="Select a category"
                options={CATEGORY}
                value={serviceDetails.category}
                onValueChange={(value) =>

                    console.log(value)
                    // setServiceDetails((prev) => ({ ...prev, category: value }))

                }
            /> */}

            <CustomDropdown
                label="Select an Option"
                options={CATEGORY}
                value={serviceDetails.category}
                onValueChange={(value) => setServiceDetails((prev) => ({ ...prev, category: value }))}
                placeholder="Select an option"
            />

            {/* Date Selection */}
            <CustomText style={styles.heading} label={WORD_DIR.selectDate} />
            <FlatList
                data={dates}
                horizontal
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleDateSelect(item.id)}
                        style={[
                            styles.dateButton,
                            selectedDateId === item.id && styles.selectedButton,
                        ]}
                    >
                        <CustomText
                            style={
                                selectedDateId === item.id ? styles.selectedDateText : styles.dateText
                            }
                            label={`${item.day}, ${item.date} ${item.month}`}
                        />
                    </TouchableOpacity>
                )}
            />

            {/* Time Slot Selection */}
            {selectedDate && (
                <>
                    <CustomText style={styles.heading} label={WORD_DIR.selectTimeSlots} />
                    <FlatList
                        data={selectedDate.timeSlots}
                        numColumns={3}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => toggleTimeSlot(item)}
                                style={[
                                    styles.timeSlotButton,
                                    item.available && styles.selectedButton,
                                    isPastTime(selectedDate, item.time) && styles.pastTimeButton,
                                ]}
                                disabled={isPastTime(selectedDate, item.time)}
                            >
                                <CustomText
                                    style={[
                                        styles.timeSlotText,
                                        item.available && styles.selectedDateText,
                                    ]}
                                    label={item.time}
                                />
                            </TouchableOpacity>
                        )}
                    />
                </>
            )}

            {/* Submit Button */}
            <CustomButton onPress={handleServiceCreation} label={WORD_DIR.createService} />
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.medium,
        backgroundColor: COLORS.white,
    },
    heading: {
        fontSize: FontSize.large,
        fontWeight: "bold",
        marginVertical: Spacing.small,
    },
    dateButton: {
        backgroundColor: COLORS.white,
        padding: Spacing.medium - 6,
        marginRight: Spacing.small,
        borderRadius: Spacing.small,
        borderWidth: 1,
    },
    dateText: {
        fontSize: FontSize.medium - 1,
        fontWeight: "bold",
    },
    selectedDateText: {
        color: COLORS.white,
    },
    selectedButton: {
        backgroundColor: COLORS.black,
    },
    timeSlotButton: {
        flex: 1,
        backgroundColor: COLORS.white,
        margin: Spacing.small,
        borderRadius: Spacing.small,
        borderWidth: 1,
        padding: Spacing.small,
        alignItems: "center",
    },
    pastTimeButton: {
        backgroundColor: COLORS.grey,
    },
    timeSlotText: {
        fontSize: FontSize.medium,
    },
});

export default CreateServiceScreen;
