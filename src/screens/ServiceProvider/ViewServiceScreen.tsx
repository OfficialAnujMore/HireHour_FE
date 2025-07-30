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
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, ServiceDetails } from 'interfaces';
import { COLORS } from '../../utils/globalConstants/color';
import {WORD_DIR} from '../../utils/local/en';

interface ViewServiceScreenProps {
  route: {
    params: ServiceDetails;
  };
}

const ViewServiceScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ViewService'>>();
  const item = route.params;

  if (!item) {
    return (
      <ScrollView style={globalStyle.globalContainer}>
        <CustomText label={WORD_DIR.noServiceDetails} style={styles.heading} />
      </ScrollView>
    );
  }

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

      <CustomText label={WORD_DIR.serviceImages} style={styles.subHeading} />
      <View style={styles.imageContainer}>
        {item.servicePreview?.map((image: any, index: number) => (
          <Image
            key={index}
            source={{uri: image.uri}}
            style={styles.image}
          />
        ))}
      </View>

      <CustomText label={WORD_DIR.serviceSchedule} style={styles.subHeading} />
      {item.selectedDates && typeof item.selectedDates === 'object' ? (
        Object.keys(item.selectedDates).map((dateKey, index) => (
          <View key={index} style={styles.scheduleItem}>
            <CustomText
              label={`Date: ${dateKey}`}
            />
            <CustomText
              label={`Available: ${(item.selectedDates as any)[dateKey]?.isAvailable ? 'Yes' : 'No'}`}
            />
          </View>
        ))
      ) : (
        <CustomText label={WORD_DIR.noScheduleAvailable} style={styles.text} />
      )}
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
