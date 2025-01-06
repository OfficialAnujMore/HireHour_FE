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

interface TimeSlot {
    id: string;
    time: string;
    available: boolean;
}

interface DateInfo {
    id: string;
    day: string;
    date: string;
    timeSlots: TimeSlot[];
}

const generateDates = (): DateInfo[] => {
    const dates: DateInfo[] = [];
    const timeSlots: TimeSlot[] = [
        { id: "1", time: "12:00 AM", available: true },
        { id: "2", time: "12:30 AM", available: true },
        { id: "3", time: "01:00 AM", available: true },
        { id: "4", time: "01:30 AM", available: true },
        { id: "5", time: "02:00 AM", available: true },
        { id: "6", time: "02:30 AM", available: true },
        { id: "7", time: "03:00 AM", available: true },
        { id: "8", time: "03:30 AM", available: true },
        { id: "9", time: "04:00 AM", available: true },
        { id: "10", time: "04:30 AM", available: true },
        { id: "11", time: "05:00 AM", available: true },
        { id: "12", time: "05:30 AM", available: true },
        { id: "13", time: "06:00 AM", available: true },
        { id: "14", time: "06:30 AM", available: true },
        { id: "15", time: "07:00 AM", available: true },
        { id: "16", time: "07:30 AM", available: true },
        { id: "17", time: "08:00 AM", available: true },
        { id: "18", time: "08:30 AM", available: true },
        { id: "19", time: "09:00 AM", available: true },
        { id: "20", time: "09:30 AM", available: true },
        { id: "21", time: "10:00 AM", available: true },
        { id: "22", time: "10:30 AM", available: true },
        { id: "23", time: "11:00 AM", available: true },
        { id: "24", time: "11:30 AM", available: true },
        { id: "25", time: "12:00 PM", available: true },
        { id: "26", time: "12:30 PM", available: true },
        { id: "27", time: "01:00 PM", available: true },
        { id: "28", time: "01:30 PM", available: true },
        { id: "29", time: "02:00 PM", available: true },
        { id: "30", time: "02:30 PM", available: true },
        { id: "31", time: "03:00 PM", available: true },
        { id: "32", time: "03:30 PM", available: true },
        { id: "33", time: "04:00 PM", available: true },
        { id: "34", time: "04:30 PM", available: true },
        { id: "35", time: "05:00 PM", available: true },
        { id: "36", time: "05:30 PM", available: true },
        { id: "37", time: "06:00 PM", available: true },
        { id: "38", time: "06:30 PM", available: true },
        { id: "39", time: "07:00 PM", available: true },
        { id: "40", time: "07:30 PM", available: true },
        { id: "41", time: "08:00 PM", available: true },
        { id: "42", time: "08:30 PM", available: true },
        { id: "43", time: "09:00 PM", available: true },
        { id: "44", time: "09:30 PM", available: true },
        { id: "45", time: "10:00 PM", available: true },
        { id: "46", time: "10:30 PM", available: true },
        { id: "47", time: "11:00 PM", available: true },
        { id: "48", time: "11:30 PM", available: true }
    ];

    // Dates from the next 30 days
    for (let i = 0; i <= 30; i++) {
        const date = moment().add(i, "days");
        const dateInfo: DateInfo = {
            id: `${i}`,
            day: date.format("ddd"),
            date: date.format("DD"),
            timeSlots: [...timeSlots], // Copy all available time slots
        };

        // Modify availability for specific dates (Example for 06 Jan)
        if (date.format("DD") === "06") {
            dateInfo.timeSlots[2].available = false; // Example: 01:00 AM slot unavailable on 06 Jan
            dateInfo.timeSlots[5].available = false; // Example: 02:30 AM slot unavailable on 06 Jan
        }
        if (date.format("DD") === "07") {
            dateInfo.timeSlots[10].available = false; // Example: 05:00 AM slot unavailable on 07 Jan
        }

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
        cost: "",
    });

    const handleServiceCreation = () => {
        if (!serviceDetails.title || !serviceDetails.description || !serviceDetails.cost) {
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
            <Text style={styles.heading}>Service Details</Text>
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={serviceDetails.title}
                onChangeText={(text) =>
                    setServiceDetails((prev) => ({ ...prev, title: text }))
                }
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={serviceDetails.description}
                onChangeText={(text) =>
                    setServiceDetails((prev) => ({ ...prev, description: text }))
                }
            />
            <TextInput
                style={styles.input}
                placeholder="Cost per hour"
                keyboardType="numeric"
                value={serviceDetails.cost}
                onChangeText={(text) =>
                    setServiceDetails((prev) => ({ ...prev, cost: text }))
                }
            />

            {/* Date Selection */}
            <Text style={styles.heading}>Select Date</Text>
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
                        <Text style={styles.dateText}>
                            {item.day}, {item.date}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            {/* Time Slot Selection */}
            {selectedDate && (
                <>
                    <Text style={styles.heading}>Select Time Slots</Text>
                    <FlatList
                        data={selectedDate.timeSlots}
                        numColumns={3}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => handleTimeSelect(item)}
                                style={[
                                    styles.timeSlotButton,
                                    selectedTimeSlots.some(
                                        (slot) => slot.id === item.id
                                    )
                                        ? styles.selectedButton
                                        : {},
                                    !item.available
                                        ? styles.unavailableButton
                                        : {},
                                    isPastTime(item.time)
                                        ? styles.pastTimeButton
                                        : {},
                                ]}
                                disabled={!item.available || isPastTime(item.time)}
                            >
                                <Text
                                    style={[
                                        styles.timeSlotText,
                                        !item.available ? styles.disabledText : {},
                                    ]}
                                >
                                    {item.time}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </>
            )}

            {/* Submit Button */}
            <TouchableOpacity
                onPress={handleServiceCreation}
                style={styles.submitButton}
            >
                <Text style={styles.submitButtonText}>Create Service</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    heading: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginVertical: 10,
    },
    dateButton: {
        backgroundColor: "#e0e0e0",
        padding: 15,
        marginRight: 10,
        borderRadius: 8,
    },
    dateText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    selectedButton: {
        backgroundColor: "#6200ea",
    },
    timeSlotButton: {
        flex: 1,
        backgroundColor: "#f0f0f0",
        padding: 10,
        margin: 5,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    timeSlotText: {
        fontSize: 14,
    },
    unavailableButton: {
        backgroundColor: "#bdbdbd",
    },
    pastTimeButton: {
        backgroundColor: "#f44336",
    },
    submitButton: {
        backgroundColor: "#6200ea",
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    submitButtonText: {
        color: "white",
        fontSize: 16,
    },
    disabledText: {
        color: "gray",
    },
});

export default CreateServiceScreen;
