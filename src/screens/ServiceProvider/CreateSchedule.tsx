import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {Screen, Spacing, FontSize} from '../../utils/dimension';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'redux/store';
import {showSnackbar} from '../../redux/snackbarSlice';
import {updateSelectedDates, clearServiceCreation} from '../../redux/serviceCreationSlice';
import {addService} from '../../services/serviceProviderService';
import CustomButton from '../../components/CustomButton';
import {COLORS} from '../../utils/globalConstants/color';
import {WORD_DIR} from '../../utils/local/en';
import CustomText from '../../components/CustomText';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from 'interfaces';
import {ApiResponse} from 'services/apiClient';
import {ErrorResponse, ServiceDetails} from 'interfaces';
import {API_RESPONSE} from '../../utils/local/apiResponse';
import {globalStyle} from '../../utils/globalStyle';
import { formatDateUS } from '../../utils/dateUtils';
import {apiWithLoader} from '../../utils/apiWithLoader';
import {getErrorMessage} from '../../utils/errorHandler';

interface SelectedDates {
  [key: string]: {selected: boolean; isAvailable: boolean};
}

interface DayObject {
  dateString: string;
}

// Utility to convert date string to ISO string
const toStartOfDayISOString = (dateStr: string) => {
  const date = new Date(dateStr);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
};

// Utility to convert ISO string to US date format (MM/DD/YYYY)
const toUSDateFormat = (isoDate: string) => formatDateUS(isoDate);

const CreateSchedule: React.FC = ({route}: any) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const serviceDetails = route.params as any; // TODO: Add proper route typing
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const serviceCreationState = useSelector((state: RootState) => state.serviceCreation);
  const today = new Date().toISOString().split('T')[0];

  // Use Redux state for selected dates, fallback to local state if needed
  const [selectedDates, setSelectedDates] = useState<SelectedDates>(serviceCreationState.selectedDates || {});

  // Initialize selected dates from route params or Redux state
  useEffect(() => {
    if (serviceDetails.schedule) {
      const initialSelectedDates: SelectedDates = {};
      serviceDetails.schedule.forEach((dateObj: {date: string}) => {
        const iso = toStartOfDayISOString(dateObj.date);
        initialSelectedDates[iso] = {selected: true, isAvailable: true};
      });
      setSelectedDates(initialSelectedDates);
      dispatch(updateSelectedDates(initialSelectedDates));
    } else if (serviceCreationState.selectedDates && Object.keys(serviceCreationState.selectedDates).length > 0) {
      setSelectedDates(serviceCreationState.selectedDates);
    }
  }, [serviceDetails.schedule, serviceCreationState.selectedDates, dispatch]);

  // Handle selecting/unselecting dates
  const handleDayPress = (day: DayObject) => {
    const isoDate = toStartOfDayISOString(day.dateString);
    // console.log(day, isoDate);

    setSelectedDates(prev => {
      const updated = {...prev};
      // If the date is already selected, remove it
      if (updated[isoDate]) {
        delete updated[isoDate];
      } else {
        // If the date is not selected, add it
        updated[isoDate] = {selected: true, isAvailable: true};
      }
      
      // Update Redux state
      dispatch(updateSelectedDates(updated));
      
      return updated;
    });
  };

  const handleServiceCreation = async (): Promise<void> => {
    // Use Redux state for service details, fallback to route params
    const finalServiceDetails = {
      title: serviceCreationState.title || serviceDetails.title,
      description: serviceCreationState.description || serviceDetails.description,
      pricing: serviceCreationState.pricing || serviceDetails.pricing,
      category: serviceCreationState.category || serviceDetails.category,
      servicePreview: serviceCreationState.servicePreview.length > 0 ? serviceCreationState.servicePreview : serviceDetails.servicePreview,
    };

    console.log('finalServiceDetails', finalServiceDetails);
    if (
      !finalServiceDetails.title ||
      !finalServiceDetails.description ||
      !finalServiceDetails.pricing
    ) {
      dispatch(
        showSnackbar({
          message: WORD_DIR.pleaseFillServiceDetails,
          success: false,
        }),
      );
      return;
    }

    const data = {
      title: finalServiceDetails.title,
      description: finalServiceDetails.description,
      pricing: finalServiceDetails.pricing,
      userId: user?.id,
      id: serviceDetails.serviceId,
      category: finalServiceDetails.category,
      servicePreview: finalServiceDetails.servicePreview,
      selectedDates: selectedDates,
    };

    const response: ApiResponse<ServiceDetails> | ErrorResponse = await apiWithLoader(
      () => addService(data),
      serviceDetails.serviceId ? 'Updating service...' : 'Creating service...'
    );

    if (response.success) {
      dispatch(
        showSnackbar({
          message: data.id
            ? API_RESPONSE.serviceUpdated
            : API_RESPONSE.serviceSuccess,
          success: true,
        }),
      );
      // Clear the service creation state after successful creation
      dispatch(clearServiceCreation());
      navigation.navigate('Tabs' as any, {screen: 'Home'});
    } else {
              dispatch(
          showSnackbar({
            message: getErrorMessage(response, 'Service creation failed. Please try again.'),
            success: false,
          }),
        );
    }
  };
  const sortedDates = Object.keys(selectedDates).sort((a, b) =>
    b > a ? 1 : -1,
  );


  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <CustomText label="Schedule Your Service" style={styles.heading} />
          <CustomText 
            label="Select the dates when you'll be available to provide your service" 
            style={styles.subHeading}
            numberOfLines={3}
          />
        </View>

        {/* Calendar Section */}
        <View style={styles.calendarSection}>
          <View style={styles.sectionHeader}>
            <CustomText label="Select Available Dates" style={styles.sectionTitle} />
            <CustomText 
              label="Tap on dates to select or deselect them" 
              style={styles.sectionSubtitle}
            />
          </View>
          
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={Object.keys(selectedDates).reduce((acc, date) => {
                const dayKey = date.split('T')[0]; // Mark using 'YYYY-MM-DD'
                acc[dayKey] = {
                  selected: true,
                  marked: true,
                  selectedColor: COLORS.primary,
                };
                return acc;
              }, {} as {[key: string]: any})}
              markingType={'multi-dot'}
              theme={{
                textSectionTitleColor: COLORS.black,
                selectedDayBackgroundColor: COLORS.primary,
                selectedDayTextColor: COLORS.white,
                todayTextColor: COLORS.primary,
                dayTextColor: COLORS.black,
                textDisabledColor: COLORS.lightGray,
                dotColor: COLORS.primary,
                selectedDotColor: COLORS.white,
                arrowColor: COLORS.primary,
                monthTextColor: COLORS.black,
                indicatorColor: COLORS.primary,
                textDayFontWeight: '300',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '600',
                textDayFontSize: FontSize.medium,
                textMonthFontSize: FontSize.large,
                textDayHeaderFontSize: FontSize.small,
              }}
              minDate={today}
            />
          </View>
        </View>

        {/* Selected Dates Section */}
        <View style={styles.selectedSection}>
          <View style={styles.sectionHeader}>
            <CustomText label="Selected Dates" style={styles.sectionTitle} />
            <CustomText 
              label={`${sortedDates.length} date(s) selected`} 
              style={styles.dateCount}
            />
          </View>
          
          {sortedDates.length > 0 ? (
            <View style={styles.selectedContainer}>
              <FlatList
                data={sortedDates}
                keyExtractor={item => item}
                scrollEnabled={false}
                renderItem={({item}) => (
                  <View style={styles.dateItem}>
                    <View style={styles.dateContent}>
                      <Icon name="event" size={20} color={COLORS.primary} />
                      <Text style={styles.dateText}>{toUSDateFormat(item)}</Text>
                    </View>
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
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Icon name="event-busy" size={48} color={COLORS.lightGray} />
              <CustomText 
                label="No dates selected yet" 
                style={styles.emptyStateText}
              />
              <CustomText 
                label="Tap on the calendar above to select your available dates" 
                style={styles.emptyStateSubtext}
              />
            </View>
          )}
        </View>

        {/* Action Section */}
        <View style={styles.actionSection}>
          <CustomButton
            label={serviceDetails.serviceId ? WORD_DIR.updateService : WORD_DIR.createService}
            onPress={handleServiceCreation}
            showLoader={true}
            loaderMessage={serviceDetails.serviceId ? 'Updating...' : 'Creating...'}
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: Spacing.medium,
  },
  headerSection: {
    paddingTop: Spacing.large,
    paddingBottom: Spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  heading: {
    fontSize: FontSize.extraLarge,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: Spacing.small,
  },
  subHeading: {
    fontSize: FontSize.medium,
    color: COLORS.gray,
    lineHeight: 22,
  },
  calendarSection: {
    paddingVertical: Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  sectionHeader: {
    marginBottom: Spacing.small,
  },
  sectionTitle: {
    fontSize: FontSize.large,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: Spacing.small,
  },
  sectionSubtitle: {
    fontSize: FontSize.small,
    color: COLORS.gray,
  },
  calendarContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: Spacing.small,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    padding: Spacing.small,
  },
  selectedSection: {
    paddingVertical: Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  dateCount: {
    fontSize: FontSize.small,
    color: COLORS.gray,
    textAlign: 'center',
  },
  selectedContainer: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    padding: Spacing.medium,
  },
  selectedContentContainer: {
    paddingBottom: Spacing.medium,
  },
  dateItem: {
    padding: Spacing.medium,
    backgroundColor: COLORS.white,
    marginVertical: Spacing.small,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dateText: {
    fontSize: FontSize.medium,
    color: COLORS.black,
    marginLeft: Spacing.small,
    fontWeight: '500',
  },
  removeIcon: {
    padding: Spacing.small,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.large,
    paddingHorizontal: Spacing.medium,
  },
  emptyStateText: {
    fontSize: FontSize.medium,
    color: COLORS.gray,
    marginTop: Spacing.medium,
    fontWeight: '500',
  },
  emptyStateSubtext: {
    fontSize: FontSize.small,
    color: COLORS.lightGray,
    textAlign: 'center',
    marginTop: Spacing.small,
    lineHeight: 18,
  },
  actionSection: {
    paddingVertical: Spacing.large,
    paddingBottom: Spacing.extraLarge,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: Spacing.medium,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default CreateSchedule;
