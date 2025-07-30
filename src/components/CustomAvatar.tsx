import React from 'react';
import {View, Image, Text, StyleSheet, Platform} from 'react-native';
import {COLORS} from '../utils/globalConstants/color';

interface CustomAvatarProps {
  imageUrl?: string;
  name: string;
  size?: number;
  borderColor?: string;
  borderWidth?: number;
}

const CustomAvatar: React.FC<CustomAvatarProps> = ({
  imageUrl,
  name,
  size = 70,
  borderColor = COLORS.success,
  borderWidth = 2,
}) => {
  const getInitials = (name: string) => {
    // Handle empty, null, or undefined names
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return '?';
    }
    
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0][0]?.toUpperCase() || '?';
    }
    return (names[0][0] + names[1][0])?.toUpperCase() || '?';
  };

  return (
    <View
      style={[
        styles.avatarContainer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: borderColor,
          borderWidth: borderWidth,
          ...Platform.select({
            android: {
              elevation: 5,
            },
            ios: {
              shadowColor: COLORS.black,
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.3,
              shadowRadius: 4,
            },
          }),
        },
      ]}>
      {imageUrl ? (
        <Image
          source={{uri: imageUrl}}
          style={{
            width: size - borderWidth * 2,
            height: size - borderWidth * 2,
            borderRadius: (size - borderWidth * 2) / 2,
          }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.initialsContainer,
            {
              width: size - borderWidth * 2,
              height: size - borderWidth * 2,
              borderRadius: (size - borderWidth * 2) / 2,
            },
          ]}>
          <Text style={[styles.initialsText, {fontSize: size * 0.4}]}>
            {getInitials(name)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  initialsContainer: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default CustomAvatar;
