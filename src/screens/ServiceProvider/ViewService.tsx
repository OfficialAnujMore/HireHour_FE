import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import CustomText from '../../components/CustomText';
import CustomCarousel from '../../components/CustomCarousel';
import { useDispatch } from 'react-redux';
import { showSnackbar } from '../../redux/snackbarSlice';
import { getServiceById } from '../../services/serviceProviderService';
import { COLORS } from '../../utils/globalConstants/color';
import { Spacing, FontSize } from '../../utils/dimension';

const ViewServiceDetails = ({ route }) => {
  const { serviceId } = route.params;
  const [serviceDetails, setServiceDetails] = useState(null);
  const dispatch = useDispatch();

//   useEffect(() => {
//     async function fetchService() {
//       try {
//         const response = await getServiceById(serviceId);
//         setServiceDetails(response);
//       } catch (error) {
//         dispatch(showSnackbar('Failed to fetch service details.'));
//       }
//     }
//     fetchService();
//   }, [serviceId]);

  if (!serviceDetails) return <ActivityIndicator size="large" color={COLORS.primary} />;

  return (
    <ScrollView style={styles.container}>
      {serviceDetails.images.length > 0 && <CustomCarousel data={serviceDetails.images} />}
      <CustomText label={serviceDetails.title} style={styles.title} />
      <CustomText label={serviceDetails.description} style={styles.description} />
      <CustomText label={`Charges per Hour: $${serviceDetails.chargesPerHour}`} style={styles.price} />
      <CustomText label={`Category: ${serviceDetails.category}`} style={styles.category} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.medium,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: FontSize.xLarge,
    fontWeight: 'bold',
    marginBottom: Spacing.small,
    color: COLORS.primary,
  },
  description: {
    fontSize: FontSize.medium,
    color: COLORS.darkGray,
    marginBottom: Spacing.small,
  },
  price: {
    fontSize: FontSize.large,
    fontWeight: 'bold',
    color: COLORS.green,
    marginBottom: Spacing.small,
  },
  category: {
    fontSize: FontSize.medium,
    fontStyle: 'italic',
    color: COLORS.blue,
  },
});

export default ViewServiceDetails;
