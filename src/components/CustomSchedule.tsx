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

interface DateInfo {
  id: string;
  day: string;
  month: string;
  date: string;
  fullDate: string;
  timeSlots: TimeSlot[];
}

interface CustomScheduleProps {
  dateInfo: DateInfo[];
  selectedTimeIds: string[]; // Changed to an array
  onValueChange: (value: string[]) => void; // Updated to accept an array
}

const CustomSchedule: React.FC<CustomScheduleProps> = ({
  dateInfo,
  selectedTimeIds,
  onValueChange,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateSelect = (id: string) => {
    setSelectedDate(id);
    // onValueChange([]); // Clear selected times when a new date is selected
  };

  const handleTimeSelect = (item: TimeSlot) => {
    const newSelectedTimes = selectedTimeIds.includes(item.id)
      ? selectedTimeIds.filter((id) => id !== item.id) // Deselect if already selected
      : [...selectedTimeIds, item.id]; // Add to selected times if not already selected

    onValueChange(newSelectedTimes); // Update parent component with selected times
  };

  const selectedDateInfo = dateInfo.find((date) => date.id === selectedDate);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Schedule</Text>
      <Text style={styles.subHeader}>Book a time slot as per your convenience</Text>

      {/* Date Selector */}
      <View style={styles.dateContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {dateInfo.map((date) => (
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
          ))}
        </ScrollView>
      </View>

      {/* Time Slots */}
      <Text style={styles.sectionHeader}>Select date and time</Text>
      <FlatList
        data={selectedDateInfo?.timeSlots || []}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.timeSlotContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            disabled={!item.available}
            style={[
              styles.timeSlot,
              selectedTimeIds.includes(item.id) && styles.selectedTimeSlot,
              !item.available && styles.unavailableTimeSlot,
            ]}
            onPress={() => handleTimeSelect(item)}
          >
            <Text
              style={[
                styles.timeSlotText,
                selectedTimeIds.includes(item.id) && styles.selectedTimeSlotText,
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
    marginBottom: 16,
  },
  dateBox: {
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginRight: 8,
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
