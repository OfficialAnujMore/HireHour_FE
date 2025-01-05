import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { Screen, Spacing } from "../utils/dimension";

const { width } = Dimensions.get("window");

interface CarouselItem {
  id: string;
  title: string;
  image: string;
}

const data: CarouselItem[] = [
  {
    id: "1",
    title: "Cleanups",
    image: "https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg", // Replace with actual image URLs
  },
  {
    id: "2",
    title: "Facials",
    image: "https://next-images.123rf.com/index/_next/image/?url=https://assets-cdn.123rf.com/index/static/assets/top-section-bg.jpeg&w=3840&q=75",
  },
  {
    id: "3",
    title: "Manicure",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfb1S0-6UMHLRUIZbblK36QTWA7qZOy6fIt-Aj_WSzsuDFGl4M-nZOOmxvFxAMNCeb1iA&usqp=CAU",
  },
];

const CustomCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slideIndex);
  };

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {data.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
          </View>
        ))}
      </ScrollView>

      {/* Slider Indicator */}
      <View style={styles.indicatorContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              activeIndex === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
  },
  card: {
    width: Screen.width, // Use the full screen width
    height: Screen.height / 3,
    overflow: "hidden",
  },
  image: {
    width: "100%", // Ensure the image takes up the full width of the card
    height: "100%",
    resizeMode: "cover",
  },
  title: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.small,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D3D3D3",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "#000",
    width: 16,
  },
});


export default CustomCarousel;
