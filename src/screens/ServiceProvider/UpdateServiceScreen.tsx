import React, {useState, useEffect} from 'react';
import {StyleSheet, Alert, ScrollView} from 'react-native';

import {FontSize, Spacing} from '../../utils/dimension';
import CustomText from '../../components/CustomText';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import {RootState} from 'redux/store';
import {useSelector} from 'react-redux';
import {updateService, fetchServiceById} from '../../services/userService';
import CustomDropdown from '../../components/CustomDropdown';
import {CATEGORY} from '../../utils/constants';

const UpdateServiceScreen = ({route, navigation}) => {
  const {serviceId} = route.params;
  const [serviceDetails, setServiceDetails] = useState({
    title: '',
    description: '',
    chargesPerHour: '',
    category: CATEGORY[Object.keys(CATEGORY)[0] as keyof typeof CATEGORY],
  });

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const service = await fetchServiceById(serviceId); // Function to fetch service details
        setServiceDetails({
          title: service.title,
          description: service.description,
          chargesPerHour: service.chargesPerHour,
          category: service.category,
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch service details.');
      }
    };

    fetchService();
  }, [serviceId]);

  const handleServiceUpdate = async () => {
    if (
      !serviceDetails.title ||
      !serviceDetails.description ||
      !serviceDetails.chargesPerHour
    ) {
      Alert.alert('Error', 'Please fill in all service details.');
      return;
    }

    try {
      await updateService(serviceId, serviceDetails); // Function to update the service
      Alert.alert('Success', 'Service updated successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'There was an issue updating the service.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <CustomText label="Update Service" style={styles.heading} />
      <CustomInput
        label="Title"
        value={serviceDetails.title}
        placeholder="Enter title"
        onValueChange={value =>
          setServiceDetails({...serviceDetails, title: value})
        }
      />
      <CustomInput
        label="Description"
        value={serviceDetails.description}
        placeholder="Enter description"
        onValueChange={value =>
          setServiceDetails({...serviceDetails, description: value})
        }
      />
      <CustomInput
        label="Charges Per Hour"
        value={serviceDetails.chargesPerHour}
        placeholder="Enter charges"
        onValueChange={value =>
          setServiceDetails({...serviceDetails, chargesPerHour: value})
        }
      />
      <CustomDropdown
        label="Select a category"
        options={CATEGORY}
        value={serviceDetails.category}
        onValueChange={value =>
          setServiceDetails({...serviceDetails, category: value})
        }
      />
      <CustomButton onPress={handleServiceUpdate} label="Update Service" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.medium,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: FontSize.large,
    fontWeight: 'bold',
    marginBottom: Spacing.small,
  },
});

export default UpdateServiceScreen;
