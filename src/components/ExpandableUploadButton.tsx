import React, {useRef, useState} from 'react';
import {
  Animated,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../utils/globalConstants/color';
import {FontSize, Spacing} from '../utils/dimension';

interface Props {
  icon?: string;
  label?: string;
  onTrigger?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  containerStyle?: ViewStyle;
  initiallyExpanded?: boolean;
}

const ExpandableUploadButton: React.FC<Props> = ({
  icon = 'add',
  label = 'Upload Image',
  onTrigger,
  style,
  textStyle,
  containerStyle,
  initiallyExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const widthAnim = useRef(
    new Animated.Value(initiallyExpanded ? 180 : 60),
  ).current;
  const textOpacity = useRef(
    new Animated.Value(initiallyExpanded ? 1 : 0),
  ).current;

  const expand = () => {
    Animated.sequence([
      Animated.timing(widthAnim, {
        toValue: 180,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start(() => {
      onTrigger?.();

      // Collapse after action
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(widthAnim, {
          toValue: 60,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setExpanded(false);
      });
    });
  };

  const handlePress = () => {
    if (!expanded) {
      setExpanded(true);
      expand();
    }
  };

  return (
    <Animated.View
      style={[styles.container, {width: widthAnim}, containerStyle]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={[styles.button, style]}>
        <Icon name={icon} size={22} color={COLORS.white} />
        <Animated.Text
          numberOfLines={1}
          style={[styles.text, {opacity: textOpacity}, textStyle]}>
          {label}
        </Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    overflow: 'hidden',
    justifyContent: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'flex-end',
    marginBottom: Spacing.small,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.medium,
  },
  text: {
    color: COLORS.white,
    fontSize: FontSize.medium,
    fontWeight: '600',
    marginLeft: Spacing.small,
    includeFontPadding: false,
  },
});

export default ExpandableUploadButton;
