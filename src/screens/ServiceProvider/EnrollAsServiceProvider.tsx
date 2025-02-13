import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Switch,
  Pressable,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {Screen, Spacing} from '../../utils/dimension';
import {COLORS} from '../../utils/globalConstants/color';
import CustomButton from '../../components/CustomButton';
import {WORD_DIR} from '../../utils/local/en';
import {updateUserRole} from '../../services/userService';
import {RootState} from '../../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {showSnackbar} from '../../redux/snackbarSlice';
import CustomText from '../../components/CustomText';
import {useNavigation} from '@react-navigation/native';
import {login} from '../../redux/authSlice';

const EnrollAsServiceProvider: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isServiceProviderEnrolled, setIsServiceProviderEnrolled] = useState(
    user?.isServiceProvider,
  );
  const [checked, setChecked] = useState(false);

  const openTerms = () => {
    Linking.openURL('https://yourwebsite.com/terms-and-conditions');
  };
  const handleEnrollment = async () => {
    try {
      const response = await updateUserRole({
        id: user?.id,
        isEnrolled: isServiceProviderEnrolled,
      });

      if (response?.data) {
        dispatch(login({user: response.data}));

        dispatch(
          showSnackbar({
            message: 'Successfully enrolled as a service provider',
            success: true,
          }),
        );
        navigation.goBack();
      }
    } catch (error: any) {
      dispatch(
        showSnackbar({
          message: error,
          success: true,
        }),
      );
    }
  };

  return (
    <View style={styles.container}>
      <CustomText label={`Hello ${user?.firstName}`} />
      <CustomText label={`Do you wish to be enrolled as a service provider?`} />
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Enroll a Service Provider</Text>
        <Switch
          value={isServiceProviderEnrolled}
          onValueChange={value => setIsServiceProviderEnrolled(value)}
          trackColor={{true: COLORS.black, false: COLORS.gray}}
          thumbColor={isServiceProviderEnrolled ? COLORS.black : COLORS.white}
        />
      </View>

      <View style={styles.boxContainer}>
        <Pressable
          onPress={() => setChecked(!checked)}
          style={styles.checkboxContainer}>
          <View style={[styles.checkbox, checked && styles.checked]} />
        </Pressable>
        <Text style={styles.text}>
          I agree to the{' '}
          <TouchableOpacity onPress={openTerms}>
            <Text style={styles.link}>Terms and Conditions</Text>
          </TouchableOpacity>
        </Text>
      </View>
      <CustomButton
        onPress={handleEnrollment}
        label={WORD_DIR.submit}
        disabled={!checked}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: Spacing.large,
    paddingTop: Spacing.extraLarge,
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

  boxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkbox: {
    width: 12,
    height: 12,
  },
  checked: {
    backgroundColor: '#000',
  },
  text: {
    fontSize: 14,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default EnrollAsServiceProvider;
