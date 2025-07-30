import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Switch,
  Pressable,
  TouchableOpacity,
  Linking,
  Animated,
} from 'react-native';
import {FontSize, Spacing} from '../../utils/dimension';
import {COLORS} from '../../utils/globalConstants/color';
import {WORD_DIR} from '../../utils/local/en';
import CustomButton from '../../components/CustomButton';
import {updateUserRole} from '../../services/userService';
import {RootState} from '../../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {showSnackbar} from '../../redux/snackbarSlice';
import CustomText from '../../components/CustomText';
import {useNavigation} from '@react-navigation/native';
import {login} from '../../redux/authSlice';
import {globalStyle} from '../../utils/globalStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import {apiWithLoader} from '../../utils/apiWithLoader';
import {getErrorMessage} from '../../utils/errorHandler';

const bulletPoints = [
  WORD_DIR.reachNewClients,
  WORD_DIR.growVisibility,
  WORD_DIR.setOwnPricing,
  WORD_DIR.getPaidSecurely,
  WORD_DIR.buildBrand,
  WORD_DIR.receiveNotifications,
  WORD_DIR.accessExclusiveEvents,
  WORD_DIR.getSupport,
];

const EnrollAsServiceProvider: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isServiceProviderEnrolled, setIsServiceProviderEnrolled] = useState<boolean>(
    Boolean(user?.isServiceProvider),
  );
  const [checked, setChecked] = useState(false);

  const animatedValues = useRef(
    bulletPoints.map(() => new Animated.Value(-200)),
  ).current;

  useEffect(() => {
    const animations = bulletPoints.map((_, i) =>
      Animated.timing(animatedValues[i], {
        toValue: 0,
        duration: 400,
        delay: i * 100,
        useNativeDriver: true,
      }),
    );
    Animated.stagger(100, animations).start();
  }, []);

  const openTerms = () => {
    Linking.openURL('https://yourwebsite.com/terms-and-conditions');
  };

  const handleEnrollment = async () => {
    try {
      const response = await apiWithLoader(
        () => updateUserRole({
          id: user?.id,
          isEnrolled: isServiceProviderEnrolled,
        }),
        'Enrolling as service provider...'
      );

      if (response?.data) {
        dispatch(login({user: response.data}));
        dispatch(
          showSnackbar({
            message: getErrorMessage(response, WORD_DIR.successfullyEnrolled),
            success: true,
          }),
        );
        navigation.goBack();
      }
    } catch (error: any) {
      dispatch(
        showSnackbar({
          message: getErrorMessage(error, 'Enrollment failed. Please try again.'),
          success: false,
        }),
      );
    }
  };

  return (
    <View style={globalStyle.globalContainer}>
      <CustomText
        label={`Welcome, ${user?.firstName}`}
        style={globalStyle.heading}
      />
      <View style={styles.infoBox}>
        <CustomText
          label={WORD_DIR.whyEnroll}
          style={styles.infoTitle}
        />
        {bulletPoints.map((point, index) => (
          <Animated.View
            key={index}
            style={[
              styles.bulletPoint,
              {transform: [{translateX: animatedValues[index]}]},
            ]}>
            <Icon
              name="checkmark-circle-outline"
              size={20}
              color={COLORS.primary}
            />
            <CustomText
              label={point}
              style={styles.bulletText}
              numberOfLines={2}
            />
          </Animated.View>
        ))}

        <View style={styles.toggleContainer}>
          <CustomText
            label={WORD_DIR.serviceProviderEnrollment}
            style={styles.toggleLabel}
          />
          <Switch
            value={isServiceProviderEnrolled}
            onValueChange={(value: boolean) => setIsServiceProviderEnrolled(value)}
            trackColor={{true: COLORS.primary, false: COLORS.primary}}
            thumbColor={isServiceProviderEnrolled ? COLORS.white : COLORS.gray}
          />
        </View>

        <View style={styles.boxContainer}>
          <Pressable
            onPress={() => setChecked(!checked)}
            style={styles.checkboxContainer}>
            <View style={[styles.checkbox, checked && styles.checked]} />
          </Pressable>
          <View style={globalStyle.footer}>
            <CustomText label={'I agree to the'} />
            <CustomText
              label={WORD_DIR.tnc}
              style={globalStyle.actionLink}
              action={openTerms}
            />
          </View>
        </View>
      </View>

      <CustomButton
        onPress={handleEnrollment}
        label={WORD_DIR.submit}
        disabled={!(isServiceProviderEnrolled && checked)}
        showLoader={true}
        loaderMessage="Enrolling..."
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  boxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkbox: {
    width: 10,
    height: 10,
  },
  checked: {
    backgroundColor: COLORS.black,
  },
  infoBox: {
    padding: Spacing.medium,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: Spacing.small,
    color: COLORS.black,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.small,
  },
  bulletText: {
    fontSize: FontSize.small + 2,
    marginLeft: 10,
    color: COLORS.gray,
  },
});

export default EnrollAsServiceProvider;
