import React from 'react';
import {
  View,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {COLORS} from '../utils/globalConstants/color';
import CustomText from './CustomText';

interface LoaderOverlayProps {
  visible: boolean;
  message?: string;
}

const LoaderOverlay: React.FC<LoaderOverlayProps> = ({
  visible,
  message = 'Loading...',
}) => {
  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      hardwareAccelerated>
      <TouchableWithoutFeedback>
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 40,
    alignItems: 'center',
    minWidth: 200,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  message: {
    marginTop: 20,
    textAlign: 'center',
    color: COLORS.black,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LoaderOverlay; 