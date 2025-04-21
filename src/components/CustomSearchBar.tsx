import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TextInput,
  Animated,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {COLORS} from '../utils/globalConstants/color';
import {Spacing, FontSize, Screen} from '../utils/dimension';

type SearchInputProps = {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onFilterPress?: () => void;
};

const CustomSearchBar: React.FC<SearchInputProps> = ({
  placeholder,
  value,
  onChange,
  onFilterPress,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: 'absolute',
    left: 45,
    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -10],
    }),
    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [FontSize.medium, FontSize.small],
    }),
    color: COLORS.gray,
    backgroundColor: COLORS.white,
    paddingHorizontal: 4,
  };

  const dismissKeyboard = () => Keyboard.dismiss();

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.wrapper}>
        <View style={styles.inputContainer}>
          <Icon
            name="search"
            size={20}
            color={COLORS.gray}
            style={styles.searchIcon}
          />
          <Animated.Text style={labelStyle}>{placeholder}</Animated.Text>
          <TextInput
            value={value}
            onChangeText={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={styles.input}
            placeholder=""
          />
          <TouchableOpacity onPress={onFilterPress}>
            <Icon
              name="options-outline"
              size={22}
              color={COLORS.black}
              style={styles.filterIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: Spacing.small,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Spacing.small,
    borderColor: COLORS.gray,
    paddingHorizontal: Spacing.small,
    position: 'relative',
    height: Screen.height / 17,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    paddingLeft: 5,
    fontSize: FontSize.medium,
    color: COLORS.black,
  },
  searchIcon: {
    marginRight: 8,
  },
  filterIcon: {
    marginLeft: 8,
  },
});

export default CustomSearchBar;
