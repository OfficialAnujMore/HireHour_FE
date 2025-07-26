import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, Easing, Image} from 'react-native';
import {COLORS} from '../../utils/globalConstants/color';
import {FontSize, Screen} from '../../utils/dimension';
import {WORD_DIR} from '../../utils/local/en';
import CustomText from '../../components/CustomText';
import logo from '../../assets/logo.png';

const SplashScreen = ({onFinish}: {onFinish: (status: boolean) => void}) => {
  const imageScale = useRef(new Animated.Value(0.8)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;

  const textTranslateY = useRef(new Animated.Value(30)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(imageScale, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(600),
        Animated.parallel([
          Animated.timing(textTranslateY, {
            toValue: 0,
            duration: 800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();

    const timer = setTimeout(() => {
      onFinish(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={logo}
        style={[
          styles.image,
          {
            transform: [{scale: imageScale}],
            opacity: imageOpacity,
          },
        ]}
      />
      <Animated.View
        style={{
          opacity: textOpacity,
          transform: [{translateY: textTranslateY}],
        }}>
        <CustomText style={styles.text} label={WORD_DIR.welcomeText} />
        <CustomText style={styles.subText} label={WORD_DIR.welcomeSubText}  numberOfLines={4}/>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  image: {
    alignSelf: 'center',
    resizeMode: 'contain',
    width: Screen.width,
    height: Screen.height * 0.4,
  },
  text: {
    fontSize: FontSize.extraLarge,
    color: COLORS.black,
    fontWeight: '500',
    alignSelf: 'center',
    marginTop: 20,
  },
  subText: {
    fontSize: FontSize.medium,
    color: COLORS.gray, // Set a different color or style for this text
    fontWeight: '400',
    alignSelf: 'center',
    textAlign: 'center',
    flexWrap: 'wrap',  // Allows text to wrap within the container
  },
});

export default SplashScreen;
