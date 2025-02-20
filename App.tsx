import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store'; // Assuming store is defined in src/store.ts
import RootNavigator from './src/navigation/RootNavigator';
import { SafeAreaView, StatusBar } from 'react-native';
import CustomSnackbar from './src/components/CustomSnackbar';

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SafeAreaProvider>

        {/* Optional: Set status bar color */}
        {/* <StatusBar barStyle="dark-content" backgroundColor="black" /> */}
        {/* <SafeAreaView> */}
          <RootNavigator />
          <CustomSnackbar/>
        {/* </SafeAreaView> */}
      </SafeAreaProvider>
    </PersistGate>
  </Provider>
);

export default App;
