import React, { useEffect, useState } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../utils/globalConstants/color';
import { RootState } from '../redux/store';
import { hideSnackbar } from '../redux/snackbarSlice';
import { FontSize, Screen, Spacing } from '../utils/dimension';

const CustomSnackbar: React.FC = () => {
  const dispatch = useDispatch();
  const { message = '', visible } = useSelector((state: RootState) => state.snackbar);
  const animation = useState(new Animated.Value(0))[0];

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (visible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      timeoutId = setTimeout(() => {
        dispatch(hideSnackbar());
      }, 3000);
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId); // Clean up timeout on unmount
    };
  }, [visible, dispatch, animation]);

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
    bottom: 0,
    backgroundColor: COLORS.black,
    padding: Spacing.medium,
    width: Screen.width,
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
