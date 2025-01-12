import React, { useEffect } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../utils/globalConstants/color';
import { RootState } from '../redux/store';
import { hideSnackbar } from '../redux/snackbarSlice';
import { FontSize, Screen, Spacing } from '../utils/dimension';

const CustomSnackbar: React.FC = () => {
  const dispatch = useDispatch();
  const { message, visible } = useSelector((state: RootState) => state.snackbar);
  const [animation] = React.useState(new Animated.Value(0));

  useEffect(() => {
    
    if (visible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        dispatch(hideSnackbar());
      }, 3000); // Auto-hide after 3 seconds
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, dispatch]);

  return (
    <Animated.View
      style={[
        styles.snackbarContainer,
        {
          opacity: animation,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.snackbarText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  snackbarContainer: {
    position: 'absolute',
    bottom: 2,
    backgroundColor: COLORS.black,
    padding: Spacing.medium,
    width:Screen.width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  snackbarText: {
    color: COLORS.white,
    fontSize: FontSize.medium,
  },
});

export default CustomSnackbar;
