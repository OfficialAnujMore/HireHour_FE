import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import RootNavigator from './src/navigation/RootNavigator';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import CustomSnackbar from './src/components/CustomSnackbar';
import LoaderOverlay from './src/components/LoaderOverlay';
import { COLORS } from './src/utils/globalConstants/color';
import ErrorBoundary from './src/components/ErrorBoundary';
import { useLoader } from './src/hooks/useLoader';

const AppContent = () => {
  const { isLoading, message } = useLoader();

  return (
    <SafeAreaProvider>
      {/* Status Bar Styling */}
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* SafeAreaView to Apply Global Background */}
      <SafeAreaView style={styles.container}>
        <RootNavigator />
        <CustomSnackbar />
        <LoaderOverlay visible={isLoading} message={message} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const App = () => (
  <ErrorBoundary>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  </ErrorBoundary>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white, // Change this to your preferred color
  },
});

export default App;
