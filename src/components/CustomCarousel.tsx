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
        scrollEventThrottle={16}>
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
    width: Screen.width,
    height: Screen.height / 3,
    overflow: 'hidden',
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
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D3D3D3',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#000',
    width: 16,
  },
});

export default CustomCarousel;
