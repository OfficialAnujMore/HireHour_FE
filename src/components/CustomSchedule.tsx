import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";

const { width } = Dimensions.get("window");

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

const CustomSchedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const dates = [
    { id: "1", day: "Wed", date: "01" },
    { id: "2", day: "Thu", date: "02" },
    { id: "3", day: "Fri", date: "03" },
    { id: "4", day: "Sat", date: "04" },
    { id: "5", day: "Sun", date: "05" },
  ];

  const timeSlots: TimeSlot[] = [
    { id: "1", time: "9:30 AM", available: true },
    { id: "2", time: "10:00 AM", available: true },
    { id: "3", time: "10:30 AM", available: false },
    { id: "4", time: "11:00 AM", available: true },
    { id: "5", time: "11:30 AM", available: true },
    { id: "6", time: "12:00 PM", available: true },
  ];

  const handleDateSelect = (id: string) => {
    setSelectedDate(id);
    setSelectedTime(null); // Reset time when a new date is selected
  };

  const handleTimeSelect = (id: string) => {
    setSelectedTime(id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Schedule</Text>
      <Text style={styles.subHeader}>Book at a time slot as per your convenience</Text>

      {/* Date Selector */}
      <View style={styles.dateContainer}>
        {dates.map((date) => (
            <ScrollView>

          <TouchableOpacity
            key={date.id}
            style={[
                styles.dateBox,
                selectedDate === date.id && styles.selectedDateBox,
            ]}
            onPress={() => handleDateSelect(date.id)}
            >
            <Text
              style={[
                  styles.dateText,
                  selectedDate === date.id && styles.selectedDateText,
                ]}
                >
              {date.day}
            </Text>
            <Text
              style={[
                  styles.dateText,
                  selectedDate === date.id && styles.selectedDateText,
                ]}
                >
              {date.date}
            </Text>
          </TouchableOpacity>
        </ScrollView>
        ))}
      </View>

      {/* Time Slots */}
      <Text style={styles.sectionHeader}>Select date and time</Text>
      <FlatList
        data={timeSlots}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.timeSlotContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            disabled={!item.available}
            style={[
              styles.timeSlot,
              selectedTime === item.id && styles.selectedTimeSlot,
              !item.available && styles.unavailableTimeSlot,
            ]}
            onPress={() => handleTimeSelect(item.id)}
          >
            <Text
              style={[
                styles.timeSlotText,
                selectedTime === item.id && styles.selectedTimeSlotText,
                !item.available && styles.unavailableTimeSlotText,
              ]}
            >
              {item.time}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9F9F9",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dateBox: {
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    width: width * 0.15,
  },
  selectedDateBox: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  dateText: {
    fontSize: 14,
    color: "#333",
  },
  selectedDateText: {
    color: "#FFF",
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  timeSlotContainer: {
    justifyContent: "center",
  },
  timeSlot: {
    margin: 4,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.28,
  },
  selectedTimeSlot: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  unavailableTimeSlot: {
    borderColor: "#E0E0E0",
    backgroundColor: "#F0F0F0",
  },
  timeSlotText: {
    fontSize: 14,
    color: "#333",
  },
  selectedTimeSlotText: {
    color: "#FFF",
  },
  unavailableTimeSlotText: {
    color: "#AAA",
  },
});

export default CustomSchedule;
