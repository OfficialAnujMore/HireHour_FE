import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    FlatList,
    StyleSheet,
    Alert,
    ScrollView,
} from "react-native";
import moment from "moment";
import { FontSize, Spacing } from "../utils/dimension";
import CustomText from "../components/CustomText";
import CustomInput from "../components/CustomInput";
import { WORD_DIR } from "../utils/local/en";
import { COLOR } from "../utils/globalConstants/color";
import CustomButton from "../components/CustomButton";

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
    timeSlots: TimeSlot[];
}

const generateDates = (): DateInfo[] => {
    const dates: DateInfo[] = [];
    const timeSlots: TimeSlot[] = [
        { id: "1", time: "12:00 AM", available: true },
        { id: "2", time: "01:00 AM", available: true },
        { id: "3", time: "02:00 AM", available: true },
        { id: "4", time: "03:00 AM", available: true },
        { id: "5", time: "04:00 AM", available: true },
        { id: "6", time: "05:00 AM", available: true },
        { id: "7", time: "06:00 AM", available: true },
        { id: "8", time: "07:00 AM", available: true },
        { id: "9", time: "08:00 AM", available: true },
        { id: "10", time: "09:00 AM", available: true },
        { id: "11", time: "10:00 AM", available: true },
        { id: "12", time: "11:00 AM", available: true },
        { id: "13", time: "12:00 PM", available: true },
        { id: "14", time: "01:00 PM", available: true },
        { id: "15", time: "02:00 PM", available: true },
        { id: "16", time: "03:00 PM", available: true },
        { id: "17", time: "04:00 PM", available: true },
        { id: "18", time: "05:00 PM", available: true },
        { id: "19", time: "06:00 PM", available: true },
        { id: "20", time: "07:00 PM", available: true },
        { id: "21", time: "08:00 PM", available: true },
        { id: "22", time: "09:00 PM", available: true },
        { id: "23", time: "10:00 PM", available: true },
        { id: "24", time: "11:00 PM", available: true }
      ]
      
    for (let i = 0; i <= 10; i++) {
        const date = moment().add(i, "days");
        const dateInfo: DateInfo = {
            id: `${i}`,
            day: date.format("ddd"),
            date: date.format("DD"),
            month: date.format("MMM"),
            timeSlots: [...timeSlots], // Copy all available time slots
        };
        dates.push(dateInfo);
    }

    return dates;
};

const CreateServiceScreen = () => {
    const [dates, setDates] = useState<DateInfo[]>(generateDates());
    const [selectedDate, setSelectedDate] = useState<DateInfo | null>(null);
    const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([]);
    const [serviceDetails, setServiceDetails] = useState({
        title: "",
        description: "",
        costPerHour: "",
    });

    const handleServiceCreation = () => {
        if (!serviceDetails.title || !serviceDetails.description || !serviceDetails.costPerHour) {
            Alert.alert("Error", "Please fill in all service details.");
            return;
        }
        if (!selectedDate || selectedTimeSlots.length === 0) {
            Alert.alert("Error", "Please select a date and time slots.");
            return;
        }

        Alert.alert(
            "Success",
            `Service created on ${selectedDate.day}, ${selectedDate.date} at ${selectedTimeSlots.map((slot) => slot.time).join(", ")}.`
        );
    };

    const isPastTime = (time: string) => {
        const currentTime = moment();
        const timeMoment = moment(time, "h:mm A");
        return currentTime.isAfter(timeMoment);
    };

    const handleDateSelect = (id: string) => {
        setSelectedDate(dates.find((date) => date.id === id) || null);
        setSelectedTimeSlots([]); // Reset time slots when a new date is selected
    };

    const handleTimeSelect = (timeSlot: TimeSlot) => {
        if (selectedTimeSlots.some((slot) => slot.id === timeSlot.id)) {
            setSelectedTimeSlots(selectedTimeSlots.filter((slot) => slot.id !== timeSlot.id));
        } else {
            setSelectedTimeSlots([...selectedTimeSlots, timeSlot]);
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Service Details */}
            <CustomText
                label={WORD_DIR.serviceDetails}
                style={styles.heading}
            />
            <CustomInput
                label={WORD_DIR.title}
                placeholder={WORD_DIR.title}
                onValueChange={(value) => setServiceDetails((prev) => ({ ...prev, title: value }))}

            />
            <CustomInput
                label={WORD_DIR.description}
                placeholder={WORD_DIR.description}
                onValueChange={(value) => setServiceDetails((prev) => ({ ...prev, description: value }))}

            />

            <CustomInput
                label={WORD_DIR.costPerHour}
                placeholder={WORD_DIR.costPerHour}
                keyboardType="numeric"
                onValueChange={(value) => setServiceDetails((prev) => ({ ...prev, costPerHour: value }))}

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
                            selectedDate?.id === item.id && styles.selectedButton,
                        ]}
                    >
                        <CustomText
                            style={selectedDate?.id === item.id ? styles.selectedDateText : styles.dateText}
                            label={`${item.day}, ${item.date} ${item.month}`}
                        />
                    </TouchableOpacity>
                )}
            />

            {/* Time Slot Selection */}
            {selectedDate && (
                <>
                    <CustomText
                        style={styles.heading}
                        label={WORD_DIR.selectTimeSlots}
                    />
                    <FlatList
                        data={selectedDate.timeSlots}
                        numColumns={3}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => handleTimeSelect(item)}
                                style={[
                                    styles.timeSlotButton,
                                    selectedTimeSlots.some((slot) => slot.id === item.id)
                                        ? styles.selectedButton
                                        : {},
                                    !item.available ? styles.unavailableButton : {},
                                    isPastTime(item.time) ? styles.pastTimeButton : {},
                                ]}
                                disabled={!item.available || isPastTime(item.time)}
                            >
                                <CustomText
                                    style={[
                                        styles.timeSlotText,
                                        selectedTimeSlots.some((slot) => slot.id === item.id)
                                            ? styles.selectedDateText
                                            : {},
                                        !item.available ? styles.disabledText : {},
                                    ]}
                                    label={item.time}
                                />
                            </TouchableOpacity>
                        )}
                    />
                </>
            )}

            {/* Submit Button */}
            <CustomButton
                onPress={handleServiceCreation}
                label={WORD_DIR.createService}
            />
            {/* <TouchableOpacity
                onPress={handleServiceCreation}
                style={styles.submitButton}
            >
                <Text style={styles.submitButtonText}>Create Service</Text>
            </TouchableOpacity> */}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.medium,
        marginBottom: Spacing.large,
        backgroundColor:COLOR.white
    },
    heading: {
        fontSize: FontSize.large,
        fontWeight: "bold",
        marginVertical: Spacing.small,
    },
    dateButton: {
        backgroundColor: COLOR.white,
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
        color: COLOR.white,
    },
    selectedButton: {
        backgroundColor: COLOR.black,
    },
    timeSlotButton: {
        display: 'flex',
        flex: 1,
        backgroundColor: COLOR.white,
        borderColor: COLOR.grey,
        padding: Spacing.small,
        margin: Spacing.small,
        borderRadius: Spacing.small,
        borderWidth: 1,
        justifyContent: "center", // Vertical centering
        alignItems: "center",    // Horizontal centering
    },
    
    timeSlotText: {
        fontSize: FontSize.small,
    },
    unavailableButton: {
        backgroundColor: COLOR.lightGrey,
    },
    pastTimeButton: {
        backgroundColor: COLOR.lightGrey,
    },
    disabledText: {
        color: "gray",
    },
});

export default CreateServiceScreen;
