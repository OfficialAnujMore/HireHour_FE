import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Switch
} from 'react-native';
import { Screen, Spacing } from '../../utils/dimension';
import { COLORS } from '../../utils/globalConstants/color';

const EnrollAsServiceProvider: React.FC = () => {
const [isServiceProviderEnrolled, setIsServiceProviderEnrolled] = useState(false);


  return (
    // <ScrollView style={styles.container}>


      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Enroll a Service Provider</Text>
        <Switch
          value={isServiceProviderEnrolled}

          onValueChange={(value) => setIsServiceProviderEnrolled(value)}
          trackColor={{ true: COLORS.red, false: COLORS.grey }}
          thumbColor={isServiceProviderEnrolled ? COLORS.red : COLORS.white}
        />
      </View>
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: Spacing.large,
    paddingTop: Spacing.extraLarge,
  },
  imageWrapper: {
    alignSelf: 'center',
    position: 'relative',
  },
  profileImage: {
    width: Screen.width / 4,
    height: Screen.width / 4,
    borderRadius: Screen.width / 8,
    borderWidth: 2,
    borderColor: COLORS.grey,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -5,
    backgroundColor: COLORS.grey,
    borderRadius: 15,
    padding: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: Spacing.large,
    marginBottom: Spacing.medium,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: Spacing.medium,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  saveButton: {
    marginTop: Spacing.extraLarge,
    backgroundColor: COLORS.red,
    borderRadius: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EnrollAsServiceProvider;
