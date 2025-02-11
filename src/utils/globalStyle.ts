import {StyleSheet} from 'react-native';
import {COLORS} from './globalConstants/color';
import {Spacing} from './dimension';

export const globalStyle = StyleSheet.create({
  sectionContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: COLORS.grey,
    marginBottom: Spacing.medium,
    padding: Spacing.small,
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  globalContainer: {
    flex: 1,
    margin:Spacing.small,
  },
});
