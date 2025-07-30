import React, {useState} from 'react';
import {View, StyleSheet, Image, TouchableOpacity, Animated} from 'react-native';
import CustomText from './CustomText';
import {FontSize, Spacing} from '../utils/dimension';
import {COLORS} from '../utils/globalConstants/color';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ServiceDetails, User} from 'interfaces';
import {WORD_DIR} from '../utils/local/en';

interface EventCardProps {
  service: ServiceDetails;
  user?: User;
  date: string;
  showActions?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  showPrice?: boolean;
  showCategory?: boolean;
  showDescription?: boolean;
  showDate?: boolean;
  showUserInfo?: boolean;
  userLabel?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  service,
  user,
  date,
  showActions = false,
  onApprove,
  onReject,
  showPrice = true,
  showCategory = true,
  showDescription = true,
  showDate = true,
  showUserInfo = true,
  userLabel = WORD_DIR.bookedBy,
}) => {
  const [approvePressed, setApprovePressed] = useState(false);
  const [rejectPressed, setRejectPressed] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [approveScale] = useState(new Animated.Value(1));
  const [rejectScale] = useState(new Animated.Value(1));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleApprovePress = () => {
    if (approveLoading) return;
    
    Animated.sequence([
      Animated.timing(approveScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(approveScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    setApprovePressed(true);
    setApproveLoading(true);
    
    setTimeout(() => {
      setApprovePressed(false);
      setApproveLoading(false);
      onApprove?.();
    }, 150);
  };

  const handleRejectPress = () => {
    if (rejectLoading) return;
    
    Animated.sequence([
      Animated.timing(rejectScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(rejectScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    setRejectPressed(true);
    setRejectLoading(true);
    
    setTimeout(() => {
      setRejectPressed(false);
      setRejectLoading(false);
      onReject?.();
    }, 150);
  };

  return (
    <View style={styles.card}>
      {/* Service Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{uri: service.servicePreview?.[0]?.uri || ''}}
          style={styles.image}
        />
        {showPrice && (
          <View style={styles.imageOverlay}>
            <View style={styles.priceTag}>
              <CustomText
                label={`$${service.pricing || '0'}`}
                style={styles.priceText}
              />
            </View>
          </View>
        )}
      </View>

      {/* Card Content */}
      <View style={styles.content}>
        {/* Service Title and Category */}
        <View style={styles.headerSection}>
          <View style={styles.titleContainer}>
            <CustomText
              label={service.title}
              style={styles.title}
              numberOfLines={2}
            />
            {showCategory && (
              <View style={styles.categoryContainer}>
                <Icon name="category" size={14} color={COLORS.gray} />
                <CustomText label={service.category} style={styles.category} />
              </View>
            )}
          </View>
        </View>

        {/* Service Description */}
        {showDescription && (
          <CustomText
            label={service.description}
            style={styles.description}
            numberOfLines={3}
          />
        )}

        {/* Date Section */}
        {showDate && (
          <View style={styles.dateSection}>
            <View style={styles.dateContainer}>
              <Icon name="event" size={16} color={COLORS.primary} />
              <CustomText
                label={`Scheduled for ${formatDate(date)}`}
                style={styles.dateText}
              />
            </View>
          </View>
        )}

        {/* User Information */}
        {showUserInfo && user && (
          <View style={styles.userSection}>
            <CustomText label={userLabel} style={styles.userSectionTitle} />
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                {user.profileImageURL ? (
                  <Image
                    source={{uri: user.profileImageURL}}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Icon name="person" size={20} color={COLORS.white} />
                )}
              </View>
              <View style={styles.userDetails}>
                <CustomText
                  label={`${user.firstName} ${user.lastName}`}
                  style={styles.userName}
                />
                <View style={styles.contactInfo}>
                  <View style={styles.contactItem}>
                    <Icon name="email" size={14} color={COLORS.gray} />
                    <CustomText label={user.email} style={styles.contactText} />
                  </View>
                  <View style={styles.contactItem}>
                    <Icon name="phone" size={14} color={COLORS.gray} />
                    <CustomText
                      label={user.phoneNumber}
                      style={styles.contactText}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        {showActions && (
          <View style={styles.actionsSection}>
            <Animated.View style={{transform: [{scale: approveScale}]}}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.approveButton,
                  approvePressed && styles.approveButtonPressed,
                  approveLoading && styles.buttonDisabled,
                ]}
                onPress={handleApprovePress}
                activeOpacity={0.8}
                disabled={approveLoading}>
                <View style={styles.buttonContent}>
                  <View style={styles.iconContainer}>
                    {approveLoading ? (
                      <Icon name="hourglass-empty" size={20} color={COLORS.white} />
                    ) : (
                      <Icon name="check-circle" size={20} color={COLORS.white} />
                    )}
                  </View>
                  <CustomText
                    label={approveLoading ? 'Processing...' : WORD_DIR.approve}
                    style={styles.actionButtonText}
                  />
                </View>
              </TouchableOpacity>
            </Animated.View>
            
            <Animated.View style={{transform: [{scale: rejectScale}]}}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.rejectButton,
                  rejectPressed && styles.rejectButtonPressed,
                  rejectLoading && styles.buttonDisabled,
                ]}
                onPress={handleRejectPress}
                activeOpacity={0.8}
                disabled={rejectLoading}>
                <View style={styles.buttonContent}>
                  <View style={styles.iconContainer}>
                    {rejectLoading ? (
                      <Icon name="hourglass-empty" size={20} color={COLORS.white} />
                    ) : (
                      <Icon name="cancel" size={20} color={COLORS.white} />
                    )}
                  </View>
                  <CustomText
                    label={rejectLoading ? 'Processing...' : WORD_DIR.reject}
                    style={styles.actionButtonText}
                  />
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    marginBottom: Spacing.medium,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.lightGray,
  },
  imageOverlay: {
    position: 'absolute',
    top: Spacing.medium,
    right: Spacing.medium,
  },
  priceTag: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    borderRadius: 20,
  },
  priceText: {
    color: COLORS.white,
    fontSize: FontSize.small,
    fontWeight: '600',
  },
  content: {
    padding: Spacing.large,
  },
  headerSection: {},
  titleContainer: {},
  title: {
    fontSize: FontSize.large,
    fontWeight: '600',
    color: COLORS.black,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  category: {
    fontSize: FontSize.small,
    color: COLORS.gray,
    fontWeight: '500',
  },
  description: {
    fontSize: FontSize.medium,
    color: COLORS.gray,
    lineHeight: 22,
  },
  dateSection: {
    paddingBottom: Spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: FontSize.medium,
    color: COLORS.primary,
    fontWeight: '500',
  },
  userSection: {},
  userSectionTitle: {
    fontSize: FontSize.medium,
    fontWeight: '600',
    color: COLORS.black,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.medium,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: FontSize.medium,
    fontWeight: '600',
    color: COLORS.black,
  },
  contactInfo: {
    gap: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactText: {
    fontSize: FontSize.small,
    color: COLORS.gray,
  },
  actionsSection: {
    flexDirection: 'row',
    gap: Spacing.medium,
    marginTop: Spacing.medium,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.medium,
    borderRadius: 16,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveButton: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  approveButtonPressed: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  rejectButton: {
    backgroundColor: COLORS.error,
    borderColor: COLORS.error,
  },
  rejectButtonPressed: {
    backgroundColor: '#D32F2F',
    borderColor: '#D32F2F',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: FontSize.medium,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.7,
    shadowOpacity: 0.05,
    elevation: 1,
  },
});

export default EventCard;
