import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {FontSize, Spacing} from '../../utils/dimension';
import CustomText from '../../components/CustomText';
import { globalStyle } from '../../utils/globalStyle';

const ViewServiceScreen = (props: any) => {
  const item = props.route.params;
  

  return (
    <ScrollView style={globalStyle.globalContainer}>
      <CustomText label={item.title} style={styles.heading} />
      <CustomText label={`Category: ${item.category}`} style={styles.text} />
      <CustomText
        label={`Description: ${item.description}`}
        style={styles.text}
      />
      <CustomText
        label={`Charges Per Hour: $${item.pricing}`}
        style={styles.text}
      />

      <CustomText label="Service Images" style={styles.subHeading} />
      <View style={styles.imageContainer}>
        {item.servicePreview.map((image, index) => (
          <Image
            key={index}
            source={{uri: image.uri}}
            style={styles.image}
          />
        ))}
      </View>

      <CustomText label="Service Schedule" style={styles.subHeading} />
      {item.schedule.map((schedule, index) => (
        <View key={index} style={styles.scheduleItem}>
          <CustomText
            label={`${schedule.day}, ${schedule.date} ${schedule.month}`}
          />
          <CustomText
            label={`Time Slots: ${schedule.timeSlots
              .map(slot => slot.time)
              .join(', ')}`}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.medium,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: FontSize.large,
    fontWeight: 'bold',
    marginBottom: Spacing.small,
  },
  text: {
    fontSize: FontSize.medium,
    marginBottom: Spacing.small,
  },
  subHeading: {
    fontSize: FontSize.medium,
    fontWeight: 'bold',
    marginTop: Spacing.medium,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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

export default ViewServiceScreen;
