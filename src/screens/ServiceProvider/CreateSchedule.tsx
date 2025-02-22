import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {Screen, Spacing, FontSize} from '../../utils/dimension';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {showSnackbar} from '../../redux/snackbarSlice';
import {addService} from '../../services/serviceProviderService';
import CustomButton from '../../components/CustomButton';
import {COLORS} from '../../utils/globalConstants/color';
import CustomText from '../../components/CustomText';
import {useNavigation} from '@react-navigation/native';
import {ApiResponse} from 'services/apiClient';
import {ErrorResponse, ServiceDetails} from 'interfaces';
import {API_RESPONSE} from '../../utils/local/apiResponse';
import {globalStyle} from '../../utils/globalStyle';

interface SelectedDates {
  [key: string]: {selected: boolean};
}

interface DayObject {
  dateString: string;
}

const CreateSchedule = (props: any) => {
  const serviceDetails = props.route.params; // Data from CreateService
  const navigation = useNavigation();
  const [selectedDates, setSelectedDates] = useState<SelectedDates>({});

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const today = new Date().toISOString().split('T')[0];

  // Initialize selected dates from serviceDetails.schedule when the component mounts
  useEffect(() => {
    if (serviceDetails.schedule) {
      const initialSelectedDates: SelectedDates = {};

      // Ensure each date string is set correctly and doesn't become [object Object]
      serviceDetails.schedule.forEach((date: string) => {
        console.log(date);

        initialSelectedDates[date.date] = {selected: true, isAvailable: true};
      });

      setSelectedDates(initialSelectedDates);
    }
  }, [serviceDetails.schedule]);

  const handleDayPress = (day: DayObject) => {
    const date = day.dateString;

    setSelectedDates(prev => {
      if (prev[date]) {
        const updated = {...prev};
        delete updated[date];
        return updated;
      } else {
        return {...prev, [date]: {selected: true, isAvailable: true}};
      }
    });
  };

  const handleServiceCreation = async (): Promise<void> => {
    if (
      !serviceDetails.title ||
      !serviceDetails.description ||
      !serviceDetails.chargesPerHour
    ) {
      dispatch(
        showSnackbar({
          message: 'Please fill in all service details.',
          success: false,
        }),
      );
      return;
    }

    const data = {
      title: serviceDetails.title,
      description: serviceDetails.description,
      chargesPerHour: serviceDetails.chargesPerHour,
      userId: user?.id,
      id: serviceDetails.serviceId,
      category: serviceDetails.category,
      servicePreview: serviceDetails.servicePreview,
      selectedDates: selectedDates,
    };
    console.log('Upsert data \n ', JSON.stringify(data));

    const response: ApiResponse<ServiceDetails> | ErrorResponse =
      await addService(data);
    if (response.success) {
      dispatch(
        showSnackbar({
          message: data.id
            ? API_RESPONSE.serviceUpdated
            : API_RESPONSE.serviceSuccess,
          success: true,
        }),
      );
      navigation.navigate('Tabs', {screen: 'Home'});
    } else {
      dispatch(
        showSnackbar({
          message: response.message,
          success: false,
        }),
      );
    }
  };

  const sortedDates = Object.keys(selectedDates).sort((a, b) =>
    b > a ? 1 : -1,
  );

  return (
    <View style={globalStyle.globalContainer}>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={selectedDates}
          markingType={'multi-dot'}
          theme={{
            selectedDayBackgroundColor: COLORS.primary,
            selectedDayTextColor: COLORS.white,
            todayTextColor: COLORS.error,
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
          data={sortedDates}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <View style={styles.dateItem}>
              <Text style={styles.dateText}>{item}</Text>
              <TouchableOpacity
                style={styles.removeIcon}
                onPress={() => handleDayPress({dateString: item})}>
                <Icon
                  name="delete"
                  size={FontSize.medium}
                  color={COLORS.error}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </ScrollView>

      <CustomButton
        label={serviceDetails.serviceId ? 'Update Service' : 'Create Service'}
        onPress={handleServiceCreation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: Spacing.large,
  },
  selectedContainer: {
    width: '100%',
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
    paddingBottom: Spacing.medium,
  },
  dateItem: {
    padding: Spacing.small,
    backgroundColor: '#fff',
    marginVertical: Spacing.small,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateText: {
    fontSize: FontSize.medium,
    color: '#000',
  },
  removeIcon: {
    position: 'absolute',
    right: Spacing.small,
    top: Spacing.small,
  },
});

export default CreateSchedule;
