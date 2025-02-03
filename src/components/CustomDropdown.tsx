import React, { useCallback, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomText from './CustomText';
import { COLORS } from '../utils/globalConstants/color';
import { FontSize, Screen, Spacing } from '../utils/dimension';

type DropdownOptions = Record<string, string>;

type CustomDropdownProps = {
  label?: string;
  errorMessage?: string;
  options: DropdownOptions;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  errorMessage,
  options,
  value,
  onValueChange,
  placeholder = 'Select an option',
  disabled = false,
}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  // Transform options from object to array format
  const transformedOptions = Object.entries(options).map(([key, label]) => ({
    value: label, // Store label directly in value
    label,
  }));

  const toggleDropdown = useCallback(() => {
    if (!disabled) setDropdownVisible((prev) => !prev);
  }, [disabled]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSelect = useCallback(
    (selectedValue: string) => {
      onValueChange(selectedValue); // Notify parent component
      setDropdownVisible(false); // Close the dropdown
    },
    [onValueChange]
  );

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        {label && <CustomText label={label} />}
        <TouchableOpacity
          style={[
            styles.dropdown,
            {
              borderColor: errorMessage
                ? COLORS.red
                : isDropdownVisible
                ? COLORS.black
                : COLORS.grey,
              backgroundColor: disabled ? COLORS.lightGrey : COLORS.white,
            },
          ]}
          onPress={toggleDropdown}
          disabled={disabled}
        >
          <Text
            style={[
              styles.dropdownText,
              { color: value ? COLORS.black : COLORS.grey },
            ]}
          >
            {value || placeholder}
          </Text>
          <Icon
            name={isDropdownVisible ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={20}
            color={COLORS.grey}
          />
        </TouchableOpacity>
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <Modal visible={isDropdownVisible} transparent animationType="fade">
          <TouchableWithoutFeedback onPress={toggleDropdown}>
            <View style={styles.modalOverlay}>
              <View style={styles.dropdownList}>
                <FlatList
                  data={transformedOptions}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => handleSelect(item.value)}
                    >
                      <Text style={styles.dropdownItemText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.small,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Screen.height / 15,
    borderWidth: 1,
    borderRadius: Spacing.small,
    paddingHorizontal: Spacing.small,
  },
  dropdownText: {
    fontSize: FontSize.medium,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownList: {
    backgroundColor: COLORS.white,
    width: '80%',
    maxHeight: '50%',
    borderRadius: Spacing.small,
    padding: Spacing.small,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.medium,
  },
  dropdownItemText: {
    fontSize: FontSize.medium,
    color: COLORS.black,
  },
});

export default CustomDropdown;
