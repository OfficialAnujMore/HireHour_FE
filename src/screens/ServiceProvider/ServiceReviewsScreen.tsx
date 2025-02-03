import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Button as RNButton,
} from "react-native";
import { AirbnbRating } from "react-native-ratings"; // Import AirbnbRating from react-native-ratings
import { Screen, Spacing, FontSize } from "../../utils/dimension";
import CustomButton from "../../components/CustomButton";

// Reviews Data (for rendering)
const reviews = [
  {
    id: "1",
    name: "Courtney Henry",
    time: "2 mins ago",
    rating: 5,
    review:
      "Consequat velit qui adipiscing tincidunt do reprehenderit ad laborum tempor ullamco exercitation.",
    avatar: "https://i.pravatar.cc/50?img=1",
  },
  {
    id: "2",
    name: "Cameron Williamson",
    time: "2 mins ago",
    rating: 4,
    review:
      "Consequat velit qui adipiscing tincidunt do reprehenderit ad laborum tempor ullamco.",
    avatar: "https://i.pravatar.cc/50?img=2",
  },
  {
    id: "3",
    name: "Jane Cooper",
    time: "2 mins ago",
    rating: 3,
    review:
      "Ullamco tempor adipiscing et voluptate duis sit esse aliqua esse ex.",
    avatar: "https://i.pravatar.cc/50?img=3",
  },
];

const RatingInput = ({ rating, onRatingChange }: any) => {
  return (
    <AirbnbRating
      count={5}
      defaultRating={rating}
      onFinishRating={onRatingChange}
      size={30} // Adjust size for better visibility
      showRating={false} // Hide the text rating and just show stars
      selectedColor="#FFD700" // Gold color for selected stars
      unSelectedColor="#d3d3d3" // Light grey for unselected stars
    />
  );
};

const ServiceReviewScreen: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const renderReview = ({ item }: any) => (
    <View style={styles.reviewCard}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.reviewContent}>
        <View style={styles.reviewHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <AirbnbRating
          count={5}
          defaultRating={item.rating}
          size={20}
          isDisabled
          showRating={false}
        />
        <Text style={styles.reviewText}>{item.review}</Text>
      </View>
    </View>
  );

  const handleSubmitReview = () => {
    // Validation
    if (rating === 0) {
      setErrorMessage("Please select a rating.");
      return;
    }

    if (!reviewText.trim()) {
      setErrorMessage("Please write a review.");
      return;
    }

    // Handle the review submission (for now, just log it)
    console.log("Review submitted:", { reviewText, rating });
    setIsModalVisible(false);
    setErrorMessage(""); // Clear error message after submission
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Koffee Cafe NYC</Text>
        <View style={styles.ratingSummary}>
          <View style={styles.barChart}>
            {[5, 4, 3, 2, 1].map((star) => (
              <View key={star} style={styles.barContainer}>
                <Text style={styles.starLabel}>{star}</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${star * 20}%` }, // Dummy progress
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
          <View style={styles.overallRating}>
            <Text style={styles.rating}>4.0</Text>
            <Text style={styles.reviewCount}>52 Reviews</Text>
          </View>
        </View>
      </View>

      {/* Reviews */}
      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.reviewList}
      />

      {/* Write Review Button */}
      <CustomButton
        label="Write a Review"
        onPress={() => setIsModalVisible(true)}
      />

      {/* Modal for Writing a Review */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Write a Review</Text>

            <RatingInput rating={rating} onRatingChange={setRating} />

            <TextInput
              style={styles.textInput}
              placeholder="Write your review..."
              value={reviewText}
              onChangeText={setReviewText}
              multiline
            />

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <View style={styles.modalActions}>
              <RNButton title="Cancel" onPress={() => setIsModalVisible(false)} />
              <RNButton title="Submit" onPress={handleSubmitReview} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.medium,
    backgroundColor: "#FFFFFF",
  },
  header: {
    marginBottom: Spacing.large,
  },
  title: {
    fontSize: FontSize.large,
    fontWeight: "bold",
    color: "#333",
    marginBottom: Spacing.small,
  },
  ratingSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  barChart: {
    flex: 3,
  },
  barContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.small / 2,
  },
  starLabel: {
    fontSize: FontSize.small,
    color: "#333",
    marginRight: Spacing.small,
  },
  progressBar: {
    flex: 1,
    height: Screen.moderateScale(6),
    backgroundColor: "#E0E0E0",
    borderRadius: Screen.moderateScale(3),
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  overallRating: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rating: {
    fontSize: FontSize.extraLarge,
    fontWeight: "bold",
    color: "#333",
  },
  reviewCount: {
    fontSize: FontSize.small,
    color: "#666",
  },
  reviewList: {
    paddingVertical: Spacing.medium,
  },
  reviewCard: {
    flexDirection: "row",
    marginBottom: Spacing.large,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: Spacing.medium,
  },
  avatar: {
    width: Screen.moderateScale(50),
    height: Screen.moderateScale(50),
    borderRadius: Screen.moderateScale(25),
    marginRight: Spacing.medium,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.small,
  },
  name: {
    fontSize: FontSize.medium,
    fontWeight: "bold",
    color: "#333",
  },
  time: {
    fontSize: FontSize.small,
    color: "#999",
  },
  reviewText: {
    fontSize: FontSize.medium,
    color: "#666",
  },
  writeReviewButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: Spacing.medium,
    borderRadius: Screen.moderateScale(8),
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.large,
  },
  writeReviewText: {
    fontSize: FontSize.large,
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: Spacing.large,
    borderRadius: 10,
    width: Screen.width - 40,
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: FontSize.large,
    fontWeight: "bold",
    marginBottom: Spacing.medium,
  },
  textInput: {
    height: 100,
    borderColor: "#DDD",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: Spacing.small,
    paddingVertical: Spacing.small,
    marginBottom: Spacing.small,
    textAlignVertical: "top",
  },
  errorText: {
    color: "red",
    fontSize: FontSize.small,
    marginBottom: Spacing.small,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ServiceReviewScreen;
