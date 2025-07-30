import React, {useState, useMemo} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import {Screen, Spacing} from '../utils/dimension';
import {CustomCarouselProps} from 'interfaces';
import {COLORS} from '../utils/globalConstants/color';

const {width} = Dimensions.get('window');

const CustomCarousel: React.FC<CustomCarouselProps> = ({data}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slideIndex);
  };

  // Memoize the indicator styles to avoid recalculating them on every render
  const indicatorStyles = useMemo(
    () =>
      data.map((_, index) => [
        styles.indicator,
        activeIndex === index && styles.activeIndicator,
      ]),
    [activeIndex, data.length],
  );

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={Screen.width - 16}
        snapToAlignment="center">
        {data.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image source={{uri: item.uri}} style={styles.image} />
          </View>
        ))}
      </ScrollView>

      {/* Slider Indicator */}
      <View style={styles.indicatorContainer}>
        {indicatorStyles.map((style, index) => (
          <View key={index} style={style} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: Screen.width - 32, // Account for padding
    height: 200,
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.lightGray,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.small,
    paddingVertical: Spacing.small,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.lightGray,
    marginHorizontal: 3,
  },
  activeIndicator: {
    backgroundColor: COLORS.primary,
    width: 20,
  },
});

export default CustomCarousel;
