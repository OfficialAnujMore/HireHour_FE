import React from 'react';
import {View, StyleSheet} from 'react-native';
import CustomText from './CustomText';
import {FontSize, Spacing} from '../utils/dimension';
import {COLORS} from '../utils/globalConstants/color';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface EventHeaderProps {
  title: string;
  count: number;
  icon: string;
  color: string;
}

const EventHeader: React.FC<EventHeaderProps> = ({
  title,
  count,
  icon,
  color,
}) => {
  return (
    <View style={styles.headerSection}>
      <View style={styles.headerContent}>
        <View style={[styles.typeIconContainer, {backgroundColor: color + '20'}]}>
          <Icon name={icon} size={24} color={color} />
        </View>
        <View style={styles.headerText}>
          <CustomText
            label={title}
            style={styles.headerTitle}
          />
          <CustomText
            label={`${count} event${count !== 1 ? 's' : ''}`}
            style={styles.headerSubtitle}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.medium,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSize.large,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: FontSize.small,
    color: COLORS.gray,
  },
});

export default EventHeader; 