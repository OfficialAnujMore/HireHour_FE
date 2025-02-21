import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {Screen, Spacing, FontSize} from '../../utils/dimension';
import CustomButton from '../../components/CustomButton';
import CustomText from '../../components/CustomText';
import {COLORS} from '../../utils/globalConstants/color';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {showSnackbar} from '../../redux/snackbarSlice';
import {WORD_DIR} from '../../utils/local/en';
import CustomSwitch from '../../components/CustomSwitch';
import { globalStyle } from '../../utils/globalStyle';

const userCategories = [
  {name: 'Art', selected: false},
  {name: 'Music', selected: false},
  {name: 'Sports', selected: false},
  {name: 'Baking', selected: false},
  {name: 'Helper', selected: false},
];

const SettingsScreen: React.FC = () => {
  const [mobileNotification, setMobileNotification] = useState<boolean>(false);
  const [emailNotification, setEmailNotification] = useState<boolean>(false);
  const [categories, setCategories] = useState(userCategories);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleCategoryToggle = (categoryName: string) => {
    setCategories(prevCategories =>
      prevCategories.map(category =>
        category.name === categoryName
          ? {...category, selected: !category.selected}
          : category,
      ),
    );
  };

  const handleSave = () => {
    dispatch(
      showSnackbar({
        message: WORD_DIR.settingsUpdated,
        success: true,
      }),
    );
  };

  return (
    <View style={globalStyle.globalContainer}>
      <ScrollView>
        <View style={styles.elevatedContainer}>
          <CustomText
            label={WORD_DIR.notificationPreference}
            style={styles.heading}
          />
          <View style={styles.settingContainer}>
            <CustomText
              label={WORD_DIR.enableMobilePushNotifications}
              style={styles.text}
            />
            <CustomSwitch
              value={mobileNotification}
              onValueChange={setMobileNotification}
            />
          </View>
          <View style={styles.settingContainer}>
            <CustomText
              label={WORD_DIR.enableEmailPushNotifications}
              style={styles.text}
            />
            <CustomSwitch
              value={emailNotification}
              onValueChange={setEmailNotification}
            />
          </View>
        </View>

        <View style={styles.elevatedContainer}>
          <CustomText label={WORD_DIR.selectInterests} style={styles.heading} />
          <CustomText
            label={WORD_DIR.selectTwoOrMore}
            style={styles.subheading}
          />
          <View style={styles.categoryContainer}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.name}
                onPress={() => handleCategoryToggle(category.name)}
                style={[
                  styles.categoryItem,
                  category.selected && styles.selectedCategory,
                ]}>
                <CustomText
                  label={category.name}
                  style={[
                    styles.categoryText,
                    category.selected && styles.selectedCategoryText,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <CustomButton
        label={WORD_DIR.saveSettings}
        onPress={handleSave}
        textStyle={{fontSize: FontSize.large}}
        disabled={categories.filter(cat => cat.selected).length < 2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  elevatedContainer: {
    backgroundColor: COLORS.white,
    borderRadius: Spacing.small,
    marginVertical: Spacing.small,
    padding: Spacing.small,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    padding: Spacing.medium,
    backgroundColor: COLORS.white,
  },
  heading: {
    fontSize: FontSize.large,
    fontWeight: 'bold',
    marginBottom: Spacing.large,
    textAlign: 'center',
  },
  settingContainer: {
    justifyContent:'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.medium,
  },
  text: {
    fontSize: FontSize.medium,
    flex: 1,
  },
  subheading: {
    fontSize: FontSize.medium,
    textAlign: 'center',
    color: COLORS.gray,
    marginBottom: Spacing.medium,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  categoryItem: {
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.medium,
    margin: Spacing.small,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  selectedCategory: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: FontSize.medium,
    color: COLORS.black,
  },
  selectedCategoryText: {
    color: COLORS.white,
  },
});

export default SettingsScreen;
