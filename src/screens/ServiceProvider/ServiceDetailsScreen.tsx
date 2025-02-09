import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import CustomText from '../../components/CustomText';
import {FontSize, Screen, Spacing} from '../../utils/dimension';
import {COLORS} from '../../utils/globalConstants/color';
import CustomSchedule from '../../components/CustomSchedule';
import CustomCarouselSlider from '../../components/CustomCarousel';
import {useNavigation} from '@react-navigation/native';
import {CustomRatingInfo} from '../../components/CustomRatingInfo';
import CustomButton from '../../components/CustomButton';
import {addToCart} from '../../redux/cartSlice';
import {ServiceDetails} from 'interfaces';


const ServiceDetailsScreen = (props: ServiceDetails) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selectedTimeIds, setSelectedTimeIds] = useState<string[]>([]);

  const item = props.route.params;
  const [schedule, setSchedule] = useState(item.schedule || []);
  const user = useSelector((state: RootState) => state.auth.user);
  const handlePress = async () => {
    const filteredSchedule = item.schedule.map(dateSlot => {
      return {
        ...dateSlot,
        timeSlots: dateSlot.timeSlots.filter(timeSlot =>
          selectedTimeIds.includes(timeSlot.id),
        ),
      };
    });

    const updatedItem = {
      ...item,
      schedule: filteredSchedule, // Replace original schedule with filtered schedule
    };

    dispatch(addToCart(updatedItem));

  };
  useEffect(() => {
    console.log(item);
  }, []);
  useEffect(() => {
    console.log(selectedTimeIds);
  }, [selectedTimeIds]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <CustomCarouselSlider data={item.servicePreview} />
        <View style={styles.detailsContainer}>
          <View style={styles.header}>
            <CustomText label={item.title} style={styles.textStyle} />
            <CustomRatingInfo rating={item.ratings} />
          </View>
          <CustomText label={item.description} style={styles.textStyle} />
        </View>
        {/* <CustomSchedule
          dateInfo={schedule}
          selectedTimeId={selectedTimeId}
          onValueChange={id => {
            setSelectedTimeId(id);

            schedule.map(item => {
              if (item.id === id) {
                return {...item, available: false}; // Set availability to false for selected time
              }
              return item;
            });
          }}
        /> */}

        <CustomSchedule
          dateInfo={schedule}
          selectedTimeIds={selectedTimeIds}
          onValueChange={id => {
            setSelectedTimeIds(id);
            // console.log(setSelectedTimeIds);
          }}
        />

        <CustomButton label={'Add to cart'} onPress={handlePress} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: Spacing.small,
  },
  carouselContainer: {
    height: Screen.height / 4,
    backgroundColor: COLORS.grey,
  },
  detailsContainer: {
    marginVertical: Spacing.small,
  },
  textStyle: {
    fontSize: FontSize.medium,
    fontWeight: '400',
  },
  ratingStyle: {
    fontSize: FontSize.small,
    color: COLORS.white,
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
  ratingsContainer: {
    backgroundColor: 'green',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.small,
    padding: Spacing.small / 2,
  },
});

export default ServiceDetailsScreen;
