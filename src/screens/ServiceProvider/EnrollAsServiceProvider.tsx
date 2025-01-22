import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Switch
} from 'react-native';
import { Screen, Spacing } from '../../utils/dimension';
import { COLORS } from '../../utils/globalConstants/color';
import CustomButton from '../../components/CustomButton';
import { WORD_DIR } from '../../utils/local/en';
import { updateUserRole } from '../../services/userService';
import { login, RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { showSnackbar } from '../../redux/snackbarSlice';

const EnrollAsServiceProvider: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [isServiceProviderEnrolled, setIsServiceProviderEnrolled] = useState(user?.userRole == 'SERVICE_PROVIDER');
  const handleEnrollment = async () => {
    try {
      const response = await updateUserRole({ id: user?.id, isEnrolled: isServiceProviderEnrolled })
      console.log(response);

      
      if (response?.data) {
          dispatch(login({ user: response.data }));
        dispatch(showSnackbar('Successfull'));
      }
    } catch (error: any) {
      dispatch(showSnackbar(error));
    }

  }


  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>Enroll a Service Provider</Text>
        <Switch
          value={isServiceProviderEnrolled}

          onValueChange={(value) => setIsServiceProviderEnrolled(value)}
          trackColor={{ true: COLORS.red, false: COLORS.grey }}
          thumbColor={isServiceProviderEnrolled ? COLORS.red : COLORS.white}
        />
      </View>
      <CustomButton onPress={handleEnrollment} label={WORD_DIR.submit} />
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
});

export default EnrollAsServiceProvider;
