import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
} from 'react-native';
import CustomText from './CustomText';
import {FontSize, Spacing} from '../utils/dimension';
import {COLORS} from '../utils/globalConstants/color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {SERVICE_CATEGORIES} from '../utils/constants';
import Slider from '@react-native-community/slider';

interface SearchFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  currentFilters?: FilterOptions;
}

export interface FilterOptions {
  priceRange: [number, number];
  selectedCategories: string[];
  searchQuery?: string;
}

const SearchFilterModal: React.FC<SearchFilterModalProps> = ({
  visible,
  onClose,
  onApply,
  currentFilters,
}) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Initialize with current filters when modal opens
  useEffect(() => {
    if (visible && currentFilters) {
      setPriceRange(currentFilters.priceRange);
      setSelectedCategories(currentFilters.selectedCategories);
    }
  }, [visible, currentFilters]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleApply = () => {
    const filters: FilterOptions = {
      priceRange,
      selectedCategories,
    };
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setPriceRange([0, 1000]);
    setSelectedCategories([]);
  };

  const categories = Object.values(SERVICE_CATEGORIES);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <CustomText style={styles.headerTitle} label="Search Filters" />
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={COLORS.black} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Price Range Section */}
          <View style={styles.section}>
            <CustomText style={styles.sectionTitle} label="Price Range" />
            <View style={styles.priceContainer}>
              <View style={styles.priceDisplay}>
                <CustomText style={styles.priceLabel} label="Min Price" />
                <CustomText
                  style={styles.priceValue}
                  label={`$${priceRange[0]}`}
                />
              </View>
              <View style={styles.priceDisplay}>
                <CustomText style={styles.priceLabel} label="Max Price" />
                <CustomText
                  style={styles.priceValue}
                  label={`$${priceRange[1]}`}
                />
              </View>
            </View>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={999}
                value={priceRange[1]}
                onValueChange={value =>
                  setPriceRange([priceRange[0], Math.round(value)])
                }
                minimumTrackTintColor={COLORS.primary}
                maximumTrackTintColor={COLORS.lightGray}
                thumbTintColor={COLORS.primary}
              />
            </View>
          </View>

          {/* Categories Section */}
          <View>
            <CustomText style={styles.sectionTitle} label="Categories" />
            <View style={styles.categoriesContainer}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    selectedCategories.includes(category) &&
                      styles.categoryChipSelected,
                  ]}
                  onPress={() => handleCategoryToggle(category)}>
                  <CustomText
                    style={[
                      styles.categoryText,
                      selectedCategories.includes(category) &&
                        styles.categoryTextSelected,
                    ]}
                    label={category}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <CustomText style={styles.resetButtonText} label="Reset" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <CustomText style={styles.applyButtonText} label="Apply Filters" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSize.large,
    fontWeight: '600',
    color: COLORS.black,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.large,
  },
  section: {
    marginTop: Spacing.large,
    paddingBottom: Spacing.large,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  sectionTitle: {
    fontSize: FontSize.large,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: Spacing.medium,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.medium,
  },
  priceDisplay: {
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: FontSize.small,
    color: COLORS.gray,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: FontSize.large,
    fontWeight: '600',
    color: COLORS.primary,
  },
  sliderContainer: {
    marginTop: Spacing.medium,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.small,
  },
  categoryChip: {
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: FontSize.small,
    color: COLORS.gray,
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: COLORS.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 12,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.medium,
    backgroundColor: COLORS.lightGray + '20',
  },
  searchIcon: {
    marginRight: Spacing.small,
  },
  searchInput: {
    fontSize: FontSize.medium,
    color: COLORS.black,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.large,
    gap: Spacing.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  resetButton: {
    flex: 1,
    paddingVertical: Spacing.medium,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: FontSize.medium,
    fontWeight: '600',
    color: COLORS.gray,
  },
  applyButton: {
    flex: 2,
    paddingVertical: Spacing.medium,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: FontSize.medium,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default SearchFilterModal;
