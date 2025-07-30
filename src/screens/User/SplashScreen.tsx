import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, Easing, Image, SafeAreaView} from 'react-native';
import {COLORS} from '../../utils/globalConstants/color';
import {FontSize, Screen, Spacing} from '../../utils/dimension';
import {WORD_DIR} from '../../utils/local/en';
import CustomText from '../../components/CustomText';
import logo from '../../assets/logo.png';

interface SplashScreenProps {
  onFinish: (status: boolean) => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({onFinish}) => {
  // Animation values
  const imageScale = useRef(new Animated.Value(0.3)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const imageRotate = useRef(new Animated.Value(0)).current;

  const textTranslateY = useRef(new Animated.Value(50)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  const logoGlow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Background fade in
    Animated.timing(backgroundOpacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Main animation sequence
    Animated.sequence([
      // Logo entrance animation
      Animated.parallel([
        Animated.timing(imageScale, {
          toValue: 1,
          duration: 1200,
          easing: Easing.elastic(1.2),
          useNativeDriver: true,
        }),
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(imageRotate, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      
      // Text animation with delay
      Animated.delay(800),
      Animated.parallel([
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 1000,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      
      // Subtle logo glow effect
      Animated.delay(500),
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoGlow, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(logoGlow, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
        ])
      ),
    ]).start();

    // Auto-finish after animation
    const timer = setTimeout(() => {
      onFinish(true);
    }, 4500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const rotateInterpolate = imageRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowInterpolate = logoGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View 
        style={[
          styles.container,
          {
            opacity: backgroundOpacity,
          },
        ]}
      >
        {/* Logo Container with Glow Effect */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              shadowOpacity: glowInterpolate,
            },
          ]}
        >
          <Animated.Image
            source={logo}
            style={[
              styles.image,
              {
                transform: [
                  {scale: imageScale},
                  {rotate: rotateInterpolate},
                ],
                opacity: imageOpacity,
              },
            ]}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Text Content */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
              transform: [{translateY: textTranslateY}],
            },
          ]}
        >
          <CustomText 
            style={styles.mainText} 
            label={WORD_DIR.welcomeText} 
          />
          <CustomText 
            style={styles.subText} 
            label={WORD_DIR.welcomeSubText}  
            numberOfLines={3}
          />
        </Animated.View>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDots}>
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={[
                  styles.loadingDot,
                  {
                    opacity: textOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 0.6],
                    }),
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: Spacing.large,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 20,
    elevation: 10,
  },
  image: {
    width: Screen.width * 0.5,
    height: Screen.height * 0.25,
    maxWidth: 200,
    maxHeight: 150,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: Spacing.extraLarge,
    paddingHorizontal: Spacing.medium,
  },
  mainText: {
    fontSize: FontSize.extraLarge,
    color: COLORS.black,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.medium,
    letterSpacing: 0.5,
  },
  subText: {
    fontSize: FontSize.medium,
    color: COLORS.gray,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: FontSize.medium * 1.4,
    paddingHorizontal: Spacing.small,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: Spacing.extraLarge * 2,
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginHorizontal: 4,
  },
});

export default SplashScreen;
