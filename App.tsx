import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import RootNavigator from './src/navigation/RootNavigator';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import CustomSnackbar from './src/components/CustomSnackbar';
import { COLORS } from './src/utils/globalConstants/color';

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SafeAreaProvider>
        {/* Status Bar Styling */}
        {/* <StatusBar barStyle="dark-content" backgroundColor="#f0f0f0" /> */}
        
        {/* SafeAreaView to Apply Global Background */}
        <SafeAreaView style={styles.container}>
          <RootNavigator />
          <CustomSnackbar />
        </SafeAreaView>
      </SafeAreaProvider>
    </PersistGate>
  </Provider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white, // Change this to your preferred color
  },
});

export default App;
