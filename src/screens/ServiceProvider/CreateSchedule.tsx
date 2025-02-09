import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {Screen, Spacing, FontSize} from '../../utils/dimension'; // assuming dimensions file is in the same directory
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importing MaterialIcons for icons
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {showSnackbar} from '../../redux/snackbarSlice';
import {addService} from '../../services/serviceProviderService';
import CustomButton from '../../components/CustomButton';
import {COLORS} from '../../utils/globalConstants/color';
import CustomText from '../../components/CustomText';
import {useNavigation} from '@react-navigation/native';
interface SelectedDates {
  [key: string]: {selected: boolean};
}

interface DayObject {
  dateString: string;
  // You can extend this interface based on other properties the day object might contain
}

const CreateSchedule = (props: any) => {
  const serviceDetails = props.route.params;

  const [selectedDates, setSelectedDates] = useState<SelectedDates>({});

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigation = useNavigation();
  // Get today's date in 'yyyy-mm-dd' format
  const today = new Date().toISOString().split('T')[0];

  const handleDayPress = (day: DayObject) => {
    const date = day.dateString;

    setSelectedDates(prev => {
      if (prev[date]) {
        // Remove date if already selected
        const updated = {...prev};
        delete updated[date];
        return updated;
      } else {
        // Add selected date
        return {...prev, [date]: {selected: true, isAvailable:true}};
      }
    });
  };

  const handleServiceCreation = async () => {
    if (
      !serviceDetails.title ||
      !serviceDetails.description ||
      !serviceDetails.chargesPerHour
    ) {
      dispatch(showSnackbar('Please fill in all service details.'));
      return;
    }

    try {
      // Prepare the data for the API call
      const data = {
        id: user?.id, // Replace with the actual user ID
        userRole: user?.isServiceProvider,
        serviceData: {
          title: serviceDetails.title,
          description: serviceDetails.description,
          chargesPerHour: serviceDetails.chargesPerHour,
          userId: user?.id,
          category: serviceDetails.category,
          servicePreview: serviceDetails.images,
          selectedDates: selectedDates,
        },
      };
      const response = await addService(data);
      if (response) {
        dispatch(showSnackbar('Service created '));
      }
    } catch (error) {
      
      
      dispatch(showSnackbar('Failed to create a service '));
    }
  };

  const sortedDates = Object.keys(selectedDates).sort((a, b) =>
    b > a ? 1 : -1,
  );

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={selectedDates}
          markingType={'multi-dot'}
          theme={{
            selectedDayBackgroundColor: COLORS.primary,
            selectedDayTextColor: COLORS.white,
            todayTextColor: COLORS.red,
            arrowColor: COLORS.primary,
          }}
          minDate={today}
        />
      </View>

      <ScrollView
        style={styles.selectedContainer}
        contentContainerStyle={styles.selectedContentContainer}>
        <CustomText label={'Selected Dates'} />
        <FlatList
          data={sortedDates} // Use sorted array of dates
          keyExtractor={item => item}
          renderItem={({item}) => (
            <View style={styles.dateItem}>
              <Text style={styles.dateText}>{item}</Text>
              <TouchableOpacity
                style={styles.removeIcon}
                onPress={() => handleDayPress({dateString: item})}>
                <Icon name="delete" size={FontSize.medium} color={COLORS.red} />
              </TouchableOpacity>
            </View>
          )}
        />
      </ScrollView>

      <CustomButton
        label="Create service"
        onPress={() => {
          handleServiceCreation();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: Spacing.medium,
    backgroundColor: '#f7f7f7',
  },
  calendarContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: Spacing.large,
  },
  selectedContainer: {
    width: '100%',
    // maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    padding: Spacing.medium,
  },
  selectedContentContainer: {
    paddingBottom: Spacing.medium, // Adds some space at the bottom of the scroll view
  },
  heading: {
    fontSize: FontSize.large,
    fontWeight: 'bold',
    color: '#3CB4E6',
    marginBottom: Spacing.small,
    textAlign: 'center',
  },
  dateItem: {
    padding: Spacing.small,
    backgroundColor: '#fff',
    marginVertical: Spacing.small,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  dateText: {
    fontSize: FontSize.medium,
    color: '#333',
    flex: 1,
  },
  removeIcon: {
    paddingLeft: Spacing.small,
  },
});

export default CreateSchedule;
