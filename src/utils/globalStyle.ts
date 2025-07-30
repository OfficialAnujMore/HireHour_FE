import {StyleSheet} from 'react-native';
import {COLORS} from './globalConstants/color';
import {FontSize, Spacing} from './dimension';

export const globalStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  sectionContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: COLORS.gray,
    // marginBottom: Spacing.medium,
    padding: Spacing.small,
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  globalContainer: {
    flex: 1,
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.small,
    backgroundColor: COLORS.white,
  },
  heading: {
    fontSize: FontSize.extraLarge,
    color: COLORS.black,
    fontWeight: '500',
    alignSelf: 'center',
    marginTop: 20,
  },
  subHeading: {
    fontSize: FontSize.medium,
    color: COLORS.gray,
    fontWeight: '400',
    alignSelf: 'center',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  actionLink: {
    marginLeft: 4,
    fontWeight: 'bold',
    color: COLORS.primary,
    textDecorationLine: 'none',
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: Spacing.large,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    flex: 1,
    justifyContent: 'space-between',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.medium,
  },
});
